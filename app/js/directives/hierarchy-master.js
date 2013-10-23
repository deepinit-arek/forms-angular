//acts as the master element to control all sub elements.
formsAngular

.controller('fngHierarchyListCtrl', function($scope, utils) {

	$scope.hoverLine = false;

	$scope.onDrop = function(event, ui) {

		var childElementNo = ui.draggable.scope().field.elementNo;

		var index = utils.getIndex($scope.record, $scope.model, childElementNo);

		$scope.record.Hierarchy[index].parent = undefined;

		$scope.onOver(event, ui);

		$scope.parsePath();

		$scope.$apply();

	}


	$scope.onOver = function(event, ui) {

		$scope.hoverLine = !$scope.hoverLine;
		$scope.$apply();

	}

	$scope.parsePath = function() {

		$scope.hierarchy = utils.createFormSchema($scope.path);
	}

	this.watchPath = function() {

		$scope.unwatchPath = $scope.$watch('path', function(neww, oldd) {

			if (neww.length !== oldd.length) {

				$scope.parsePath();

			}

		}, true);

	}

	$scope.addChild = function() {

		if ($scope.model !== undefined) {

			var arrayField = $scope.add(),
				elementNo, order;

			// if (arrayField)

			elementNo = isNaN($scope.getNextElementNo(arrayField)) ? 0 : $scope.getNextElementNo(arrayField);
			order = isNaN(_.max($scope.hierarchy, function(el) {
				return el.order
			}).order + 1) ? 0 : _.max($scope.hierarchy, function(el) {
				return el.order
			}).order + 1;

			arrayField.push({
				elementNo: elementNo,
				order: order
			});

		} else {

			$scope.$emit('showErrorMessage', {
			    title: 'You can\'t do that',
			    body: 'You need to provide a name and then save it before adding any elements.'
			});

		}

		
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

		elementArray.sort(function compareNumbers(a, b) {
			return a - b;
		});

		return elementArray[elementArray.length - 1] + 1;

	}
})

.directive('fngHierarchyList', function(utils) {

	return {

		restrict: 'E',

		templateUrl: '/template/hierarchy-master.html',

		scope: true,

		replace: true,

		controller: 'fngHierarchyListCtrl',

		link: function(scope, element, attrs, fngHierarchyListCtrl) {

			//add watch to ensure loading works correctly

			var bootstrap = scope.$watch('record', function(neww, oldd) {

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

					scope.parsePath();

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