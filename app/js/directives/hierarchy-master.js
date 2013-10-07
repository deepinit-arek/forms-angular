//acts as the master element to control all sub elements.
formsAngular

.directive('fngHierarchyList', function($compile, utils) {

	return {

		restrict: 'E',

		templateUrl: '/template/hierarchy-master.html',

		scope: true,

		replace: true,

		compile: function(tElement, tAttrs, transclude) {

			return {

				post: function(scope, element, attrs) {

					//FUNCTION DEFINITIONS

					scope.parsePath = function parsePath() {

						scope.hier = utils.createFormSchema(scope.path);
					}

					scope.watchPath = function() {

						scope.unwatchPath = scope.$watch('path', function(neww, oldd) {

							if (neww.length !== oldd.length) {

								scope.parsePath();

							}

						}, true);

					}

					scope.add = function() {

						var arrayField;
						var fieldParts = scope.model.split('.');
						arrayField = scope.record;
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

					scope.getNextElementNo = function(arrayField) {

						var elementArray = [];

						for (var i = arrayField.length - 1; i >= 0; i--) {
							elementArray.push(arrayField[i].elementNo);
						};

						elementArray.sort();

						return elementArray[elementArray.length - 1] + 1;

					}

					scope.addChild = function() {

						var arrayField = scope.add();

						arrayField.push({
							elementNo: scope.getNextElementNo(arrayField)
						});
					}

					//MAIN

					//quick and dirty. Assumes its always second level from record.
					//e.g. record.Hierarchy TODO make generic.
					var path = attrs.record.split('.');

					// if (path.length === 2) {

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
					// }

					scope.parsePath();

					scope.watchPath();

					scope.schemaName = attrs.schema;



				}
			}
		}

	};
});