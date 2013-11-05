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
	};

	$scope.onOver = function(event, ui) {
		$scope.hoverLine = !$scope.hoverLine;
		$scope.$apply();
	};

	$scope.parsePath = function() {
		$scope.hierarchy = utils.createFormSchema($scope.path);
	};

	this.watchPath = function() {
		$scope.unwatchPath = $scope.$watch('path', function(neww, oldd) {
			if (neww.length !== oldd.length) {
				$scope.parsePath();
			}
		}, true);
	};

	$scope.addChild = function() {

		if ($scope.model !== undefined) {
			var arrayField = $scope.add(),
				elementNo, order;

			elementNo = $scope.getNextElementNo(arrayField);
			elementNo = isNaN(elementNo) ? 0 : elementNo;

			order = _.max($scope.hierarchy, function(el) {return el.order}).order + 1;
            order = isNaN(order) ? 0 : order;

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
	};

	$scope.add = function() {
		var arrayField;
		var fieldParts = $scope.model.split('.');
		arrayField = $scope.record;
		var l = fieldParts.length;
        if (!arrayField[fieldParts[0]]) {
            if (0 === l - 1) {
                arrayField[fieldParts[0]] = [];
            } else {
                arrayField[fieldParts[0]] = {};
            }
        }
        return arrayField[fieldParts[0]];
	};

	$scope.getNextElementNo = function(arrayField) {
        return _.max(arrayField,function(obj) {return obj.elementNo}).elementNo + 1;
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
			var bootstrap = scope.$watch('record', function(neww) {
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
