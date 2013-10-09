//acts as the master element to control all sub elements.
formsAngular

.controller('fngHierarchyListCtrl', function ($scope, utils) {

	$scope.hoverLine = false;

	// var getIndex = utils.getIndex;

	$scope.onDrop = function (event, ui) {	

		var childElementNo = ui.draggable.scope().field.elementNo;

		var index = utils.getIndex($scope.record, $scope.model, childElementNo);

		$scope.record.Hierarchy[index].parent = undefined;

		$scope.masterOnOut(event, ui);

		parsePath();

		$scope.$apply();

	}

	$scope.onOver = function (event, ui) {

		$scope.hoverLine = !$scope.hoverLine;
		$scope.$apply();
		
	}

	$scope.masterOnOut = function (event, ui) {

		$scope.hoverLine = !$scope.hoverLine;
		$scope.$apply();


		
	}
	
	function parsePath() {

		$scope.hierarchy = utils.createFormSchema($scope.path);

		


	}

	// this.updateOrder = function updateOrder () {


	// 	function traverse(el) {
	// 		var index;

	// 		for (var i = el.length - 1; i >= 0; i--) {

	// 			index = getIndex($scope.record, $scope.model, el[i].elementNo);

	// 			$scope.record[$scope.model][index].order = el[i].order;

	// 			if (el[i].content) {
	// 				traverse(el[i].content);
	// 			}

	// 		};


	// 	}

	// 	traverse($scope.hierarchy);

	// }




	//TODO this is messsy - move out
	this.parsePath = parsePath;
	$scope.parsePath = parsePath;

	this.watchPath = function() {



		$scope.unwatchPath = $scope.$watch('path', function(neww, oldd) {

			if (neww.length !== oldd.length) {

				parsePath();

			}

		}, true);

	}

	$scope.add = function() {

		var arrayField;
		var fieldParts = $scope.model.split('.');
		arrayField = $scope.record;
		for (var i = 0, l = fieldParts.length; i < l; i++) {
			if (!arrayField[fieldParts[i]]) {
				if (i === l - 1) {
					arrayField[fieldParts[i]] = [];
				} else {
					arrayField[fieldParts[i]] = {};
				}
			}
			return arrayField = arrayField[fieldParts[i]];
		}

	}

	$scope.getNextElementNo = function(arrayField) {

		var elementArray = [];

		for (var i = arrayField.length - 1; i >= 0; i--) {
			elementArray.push(arrayField[i].elementNo);
		};

		elementArray.sort(function compareNumbers(a, b) {  return a - b;});

		return elementArray[elementArray.length - 1] + 1;

	}

	$scope.addChild = function() {

		var arrayField = $scope.add();

		arrayField.push({
			elementNo: $scope.getNextElementNo(arrayField),
			order: _.max($scope.hierarchy, function (el){return el.order}).order + 1
		});
	}

	$scope.onOut = function(event, ui) {

	    var element = angular.element(event.target).scope().field;

	    if (element !== undefined) {

	    	if (element.type === 'container') {

	    	    $scope.hoverLine = !$scope.hoverLine;

	    	    $scope.$apply();

	    	}	
	    } else {



	    }
	}
})

.directive('fngHierarchyList', function(utils) {

	return {

		restrict: 'E',

		templateUrl: '/template/hierarchy-master.html',

		scope: true,

		replace: true,

		controller: 'fngHierarchyListCtrl',

		link: function (scope, element, attrs, fngHierarchyListCtrl){

			//add watch to ensure loading works correctly

			var bootstrap = scope.$watch('record', function (neww, oldd){

				if (neww._id !== undefined) {

					//quick and dirty. Assumes its always second level from record.
					//e.g. record.Hierarchy TODO make generic.
					var path = attrs.record.split('.');

						scope.model = path[1];

						if (scope[path[0]] === undefined) {

							scope[path[0]] = {};
							scope.path = scope[path[0]][path[1]] = [];
						} else {
							if (scope[path[0]][path[1]] === undefined) {
								scope.path = scope[path[0]][path[1]] = [];
							} else {
								scope.path = scope[path[0]][path[1]];
							}
						}

					fngHierarchyListCtrl.parsePath();

					utils.updateOrder(scope);

					fngHierarchyListCtrl.watchPath();

					//done my job, remove the watch;
					bootstrap();

				}

				

			}, true);

			scope.schemaName = attrs.schema;

		}
	};
});