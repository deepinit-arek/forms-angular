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
				pre: function(scope, element, attrs) {

					//quick and dirty.
					var path = attrs.record.split('.');

					if (path.length === 2) {

						scope.model = path[1];

						if (scope[path[0]][path[1]] === undefined) {
							scope[path[0]][path[1]] = [];
						}
						path = scope[path[0]][path[1]] || [];
					}

					scope.path = path;

				},

				post: function(scope, element, attrs) {

					scope.parsePath = function parsePath() {

						scope.hier = utils.createFormSchema(scope.path);

						console.log(scope.path);
						console.log(scope.hier);

					}

					scope.parsePath();

					scope.watchPath = function() {

						scope.unwatchPath = scope.$watch('path', function(neww, oldd) {

							//we only care if its a new model and not amendments to the model?
							if (neww.length !== oldd.length) {

								scope.parsePath();

							}

						}, true);

					}

					scope.watchPath();

					scope.schemaName = attrs.schema;

					scope.add = function() {

						var arrayField;
						var fieldParts = scope.model.split('.');
						arrayField = scope.record;
						// var elementNo = arrayField[fieldParts;]
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


					scope.addChild = function() {

						var arrayField = scope.add();

						arrayField.push({
							elementNo: arrayField.length
						});
					}
				}
			}
		}

	};
});