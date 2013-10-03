//acts as the master element to control all sub elements.
formsAngular

.directive('faHierarchyList', function($compile, utils) {

	return {

		restrict: 'E',

		templateUrl: '/template/hierarchy-master.html',

		scope: true,

		replace: true,


		compile: function(tElement, tAttrs, transclude) {

			return {
				pre: function(scope, element, attrs) {

					// scope.$watch('record', function() {
					// 	// console.log(scope.path);
					// }, true);

					//quick and dirty.
					var path = attrs.record.split('.');

					// if (path.length === 1) {

					//     path = scope[path[0]];

					// }

					if (path.length === 2) {

						scope.model = path[1];

						if (scope[path[0]][path[1]] === undefined) {
							scope[path[0]][path[1]] = [];
						}

						path = scope[path[0]][path[1]] || [];


					}



					// if (path.length === 3) {
					//     path = scope[path[0]][path[1]][path[2]];
					// }

					// console.log(path);

					scope.path = path;



				},
				post: function(scope, element, attrs) {

					scope.parsePath = function parsePath() {

						scope.hier = utils.createFormSchema(scope.path);

						console.log(scope.path);
						console.log(scope.hier);

					}

					scope.parsePath();

					scope.watchPath = function () {

						scope.unwatchPath = scope.$watch('path', function(neww, oldd) {

							
							//we only care if its a new model and not amendments to the model?
							if (neww.length !== oldd.length) {
								// scope.unwatchPath();

								scope.parsePath();

							}

						}, true);

					}

					scope.watchPath();

					scope.schemaName = attrs.schema;

					// scope.path = scope.parentName + '.' + scope.field.elementNo;

					// scope.toggleShow = function() {

					//     if (scope.field.name === undefined) {
					//         scope.remove(scope.parentName, scope.$index);
					//     }

					//     scope.field.elementNo = scope.$index;

					//     scope.toggleCPElement = !scope.toggleCPElement;

					// }

					// scope.$watch('field.dataType', function(newVal, oldVal) {
					//     if (newVal === 'container') {
					//         scope.iconType = 'icon-folder-close';
					//     } else {
					//         scope.iconType = 'icon-list';
					//     }

					// }, true);

					// scope.removeLine = function(parentName, index) {

					//     // scope.$apply(function () {

					//     scope.remove(parentName, index);
					//     // scope.toggleShow();

					//     // })

					//     // scope.updateView();
					// }


					// scope.$watch('$last', function(v, b, c, d, e, f, g, h) {});

					// scope.updateView = function() {

					//     if (scope.$last) {

					//     }



					// }

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

						// scope.unwatchPath();

					}

					// if (arrayField instanceof Array) {


					// }

					// if (arrayField instanceof Object) {

					//     arrayField.children = [];

					//     arrayField.children.push({parent: scope.field.elementNo});

					// }


					// scope.save();

					// console.log(scope.record);



					// var test = scope.add(scope.parentName);

					// scope.toggleChildElement = !scope.toggleChildElement;



					function getParentName() {}

				}
			}
		}

	};
});