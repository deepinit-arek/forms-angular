//acts as the master element to control all sub elements.

// Scope variables:
// hierarchy:  An array with one element per root level node.  Container elements have 'content' - an array of children.  All elements have a parent, which is hierarchy itself at the top level

formsAngular

.controller('fngHierarchyListCtrl', function($scope, utils) {

    $scope.hoverLine = false;

    // TODO: (hierref) see if we need the first two parameters
    $scope.getIndex = function(record, treeElement, reqElementNo) {
        for (var i = 0; i < record[treeElement].length; i++) {
            if (record[treeElement][i][$scope.hierarchyOptions.elementNoFld] === reqElementNo) {
                return i;
            }
        }
        return i;   // Steve - why?  An explanatory comment would be good here
    };

	$scope.onDrop = function(event, ui) {
		var childElementNo = ui.draggable.scope().field[$scope.hierarchyOptions.elementNoFld];
		var index = $scope.getIndex($scope.record, $scope.hierarchyOptions.name, childElementNo);
		$scope.record[$scope.hierarchyOptions.name][index][$scope.hierarchyOptions.parentFld] = undefined;
		$scope.onOver(event, ui);
		$scope.parsePath();
		$scope.$apply();
	};

	$scope.onOver = function(event, ui) {
		$scope.hoverLine = !$scope.hoverLine;
		$scope.$apply();
	};

    // TODO: (hierref) see if we need the first parameter
    // TODO: (hierref) see if we can merge the called functions in
    $scope.createFormSchema = function(assessmentLayout, readOnly) {
        var fields = $scope.buildHierarchy(assessmentLayout, readOnly);
        return $scope.sort(fields);
    };

    $scope.getNewItem = function(item, readOnly, parentContainer) {
        // Steve - get new item for what?  What kind of item?

        var newItem = {};
        newItem = angular.copy(item);
        //sort the name field:

        if (!item.label) {
            newItem.name = 'here is a blank name';
        } else {
            newItem.name = 'Here is a name'; //item.label;
        }

        newItem.id = 'f_' + item[$scope.hierarchyOptions.elementNoFld];

        newItem.type = 'text' ; //!item.dataType ? 'text' : item.dataType;

        if (newItem.type === 'textarea') {
            newItem.rows = "auto";
        }

        newItem.readonly = readOnly;
        newItem.parentReference = parentContainer;
        return newItem;
    };

    $scope.buildHierarchy = function(arry, readOnly) {

        var roots = [],
            content = {},
            len,
            newItem,
            i;

        // find the top level nodes and hash the content based on parent
        for (i = 0, len = arry.length; i < len; ++i) {

            var item = arry[i],
                p = item[$scope.hierarchyOptions.parentFld] === undefined ? undefined : item[$scope.hierarchyOptions.parentFld];

            //transform the item

            if (item.hide !== true) {

                var target = p == undefined ? roots : (content[p] || (content[p] = []));
                newItem = $scope.getNewItem(item, readOnly, target);
                target.push(newItem);
            }
        }

        // function to recursively build the tree
        var findChildren = function(parent) {
            if (content[parent[$scope.hierarchyOptions.elementNoFld]]) {
                parent.content = content[parent[$scope.hierarchyOptions.elementNoFld]];
                for (var i = 0, len = parent.content.length; i < len; ++i) {
                    findChildren(parent.content[i]);
                }
            }
        };

        // enumerate through to handle the case where there are multiple roots
        for (i = 0, len = roots.length; i < len; ++i) {
            findChildren(roots[i]);
        }

        return roots;
    };

//custom sort function
    $scope.sort = function(tree) {

        var order = 0, orderFld = $scope.hierarchyOptions.orderFld;

        function comparator(a, b) {
            if (a[orderFld] === undefined) {
                a[orderFld] = order;
                order++;
            }
            if (b[orderFld] === undefined) {
                b[orderFld] = order;
                order++;
            }
            return (a[orderFld]- b[orderFld]);
        }

        function sortRecurse(el) {
            order = 0;
            el.sort(comparator);
            for (var i = el.length - 1; i >= 0; i--) {
                if (el[i].content) {
                    sortRecurse(el[i].content);
                }
            }
            return el;
        }

        return sortRecurse(tree);
    };

    // TODO: (hierref) most of the parameters passed in and out are probably not required
    $scope.updateOrder = function(scope) {

        function traverse(el) {
            var index;
            for (var i = el.length - 1; i >= 0; i--) {
                index = $scope.getIndex(scope.record, $scope.hierarchyOptions.name, el[i][$scope.hierarchyOptions.elementNoFld]);
                scope.record[$scope.hierarchyOptions.name][index][scope.hierarchyOptions.orderFld] = el[i][$scope.hierarchyOptions.orderFld];
                if (el[i].content) {
                    traverse(el[i].content);
                }
            }
        }

        traverse(scope.hierarchy);
    };

	$scope.parsePath = function() {
		$scope.hierarchy = $scope.createFormSchema($scope.path);
	};

	this.watchPath = function() {
		$scope.unwatchPath = $scope.$watch('path', function(neww, oldd) {
			if (neww.length !== oldd.length) {
				$scope.parsePath();
			}
		}, true);
	};

	$scope.addChild = function() {

		if ($scope.hierarchyOptions.name) {
			var arrayField = $scope.add(),
				elementNo, order;

			elementNo = $scope.getNextElementNo(arrayField);
			elementNo = isNaN(elementNo) ? 0 : elementNo;

			order = _.max($scope.hierarchy, function(el) {return el[$scope.hierarchyOptions.orderFld]})[$scope.hierarchyOptions.orderFld] + 1;
            order = isNaN(order) ? 0 : order;

            var childObj = {};
            childObj[$scope.hierarchyOptions.orderFld] = order;
            childObj[$scope.hierarchyOptions.elementNoFld] = elementNo;
			arrayField.push(childObj);
		} else {
			$scope.$emit('showErrorMessage', {
			    title: 'You can\'t do that',
			    body: 'You need to provide a name and then save it before adding any elements.'
			});
		}
	};

	$scope.add = function() {
//		var arrayField;
//		var fieldParts = $scope[$scope.hierarchyOptions.name].split('.');
//		arrayField = $scope.record;
//		var l = fieldParts.length;
//        if (!arrayField[fieldParts[0]]) {
//            if (0 === l - 1) {
//                arrayField[fieldParts[0]] = [];
//            } else {
//                arrayField[fieldParts[0]] = {};
//            }
//        }
//        return arrayField[fieldParts[0]];
        return $scope.record[$scope.hierarchyOptions.name] || [];
	};

	$scope.getNextElementNo = function(arrayField) {
        return _.max(arrayField,function(obj) {return obj[$scope.hierarchyOptions.elementNoFld]})[$scope.hierarchyOptions.elementNoFld] + 1;
	};

    $scope.getHierarchyLabel = function(field) {
        var result = '';

        if ($scope['_hierarchy_list_']) {
            for (var i = 0 ; i < $scope['_hierarchy_list_'].length ; i ++) {
                result += $scope.getListData(field, $scope['_hierarchy_list_'][i].name) + ' ';
            }
        }
        return result;
    };

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
					//TODO: make generic.
					var path = attrs.record.split('.');

//					scope.treeElement = path[1];

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
					scope.updateOrder(scope);
					fngHierarchyListCtrl.watchPath();

					//done my job, remove the watch;
					bootstrap();
				}
			}, true);
			scope.schemaName = attrs.schema;
		}
	};
});
