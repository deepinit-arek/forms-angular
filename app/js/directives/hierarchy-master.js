//acts as the master element to control all sub elements.
formsAngular

.directive('fngHierarchyList', function($compile, utils) {

	return {

		restrict: 'E',

		templateUrl: '/template/hierarchy-master.html',

		scope: true,

		replace: true,

		controller: function ($scope, $element, $attrs, $transclude) {

			//add watch to ensure loading works correctly

			var bootstrap = $scope.$watch('record', function (neww, oldd){

				if (neww._id !== undefined) {

					//quick and dirty. Assumes its always second level from record.
					//e.g. record.Hierarchy TODO make generic.
					var path = $attrs.record.split('.');

						$scope.model = path[1];

						if ($scope[path[0]] === undefined) {

							$scope[path[0]] = {};
							$scope.path = $scope[path[0]][path[1]] = [];
						} else {
							if ($scope[path[0]][path[1]] === undefined) {
								$scope.path = $scope[path[0]][path[1]] = [];
							} else {
								$scope.path = $scope[path[0]][path[1]];
							}
						}

					$scope.parsePath();

					$scope.watchPath();

					//done my job, remove the watch;
					bootstrap();

				}

				

			}, true);

			$scope.hoverLine = false;

			$scope.getIndex = function(model, elementNo) {



			    var record = $scope.record,
			        index = -1;

			    for (var i = 0; i < record[model].length; i++) {
			        if (record[model][i]['elementNo'] === elementNo) {
			            return i;
			        }
			    }

			    return i;

			}

			$scope.onDrop = function (event, ui) {

				var childElementNo = ui.draggable.scope().field.elementNo;

				var index = $scope.getIndex('Hierarchy', childElementNo);

				$scope.record.Hierarchy[index].parent = undefined;

				$scope.masterOnOut(event, ui);

				$scope.parsePath();

			}

			$scope.onOver = function (event, ui) {

				$scope.hoverLine = !$scope.hoverLine;
				$scope.$apply();
				
			}

			$scope.masterOnOut = function (event, ui) {

				$scope.hoverLine = !$scope.hoverLine;
				$scope.$apply();


				
			}
			
			$scope.parsePath = function () {



				$scope.hier = utils.createFormSchema($scope.path);
			}

			$scope.watchPath = function() {

				$scope.unwatchPath = $scope.$watch('path', function(neww, oldd) {

					if (neww.length !== oldd.length) {

						$scope.parsePath();

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
					elementNo: $scope.getNextElementNo(arrayField)
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

			

			$scope.schemaName = $attrs.schema;
		
		}
	};
});