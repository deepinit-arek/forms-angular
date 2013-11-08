formsAngular

.controller('fngHierarchyChildCtrl', function($scope, utils) {

    $scope.index = $scope.getIndex($scope.record, $scope.treeElement, $scope.node[$scope.hierarchyOptions.elementNoFld]);

    $scope.hoverLine = false;

    if ($scope.node.isContainer) {
        $scope.toggleChildElement = $scope.record[$scope.treeElement][$scope.getIndex($scope.record, $scope.treeElement, $scope.node[$scope.hierarchyOptions.elementNoFld])]['displayStatus'];
    }

    function toggleFolderIcon() {
        if ($scope.node.isContainer) {
            if ($scope.toggleChildElement === true) {
                $scope.iconType = 'icon-folder-open';
            } else {
                $scope.iconType = 'icon-folder-close';
            }
        } else {
            $scope.iconType = 'icon-file';
        }
    }

    toggleFolderIcon();
    $scope.toggleFolderIcon = toggleFolderIcon;

    $scope.toggleChildren = function(value) {
        if (value) {
            $scope.toggleChildElement = value;
        } else {
            $scope.toggleChildElement = !$scope.toggleChildElement;
        }
        //record the order for when initialising.
        $scope.record[$scope.treeElement][$scope.getIndex($scope.record, $scope.treeElement, $scope.node[$scope.hierarchyOptions.elementNoFld])]['displayStatus'] = $scope.toggleChildElement;
        toggleFolderIcon();
    };

    $scope.toggleHoverLine = function() {
        $scope.hoverLine = !$scope.hoverLine;
        $scope.$apply();
    };

    $scope.onDrop = function(event, ui) {

        var dragged = ui.draggable.scope().node,
            dropTarget = angular.element(event.target).scope().node,
            newParentElementNo = dropTarget[$scope.hierarchyOptions.elementNoFld],
            childElementNo = dragged[$scope.hierarchyOptions.elementNoFld],
            childIndex = $scope.getIndex($scope.record, $scope.treeElement, childElementNo),
            currentParent = $scope.record[$scope.treeElement][childIndex][$scope.hierarchyOptions.parentFld],
            dropTargetParent = $scope.record[$scope.treeElement][$scope.getIndex($scope.record, $scope.treeElement, newParentElementNo)][$scope.hierarchyOptions.parentFld],
            reOrderStartIndex,
            i;

        function renumberHigherElements() {
            for (i = 0; i < dropTarget.parentReference.length; i++) {
                if (dropTarget.parentReference[i][$scope.hierarchyOptions.elementNoFld] === dropTarget[$scope.hierarchyOptions.elementNoFld]) { //move
                    reOrderStartIndex = i + 1;
                    break;
                }
            }
            for (i = reOrderStartIndex; i < dropTarget.parentReference.length; i++) {
                dropTarget.parentReference[i][$scope.hierarchyOptions.orderFld] = dropTarget.parentReference[i][$scope.hierarchyOptions.orderFld] + 1;
            }
            dragged[$scope.hierarchyOptions.orderFld] = dropTarget[$scope.hierarchyOptions.orderFld] + 1;
            $scope.updateOrder($scope);
        }

        //if dropping onto a container, and the target is open, then move the element.
        if (dropTarget.isContainer && angular.element(event.target).scope().toggleChildElement === true) {
            if (currentParent !== newParentElementNo) {
                $scope.record[$scope.treeElement][childIndex][$scope.hierarchyOptions.parentFld] = newParentElementNo;
            } else {
                renumberHigherElements()
            }
        } else if (currentParent === dropTargetParent) {
            renumberHigherElements()
        }
        $scope.parsePath();
        $scope.toggleHoverLine();
    };

    $scope.onOver = function(event, ui) {
        $scope.toggleHoverLine();
    };

    $scope.onOut = function(event, ui) {
        $scope.toggleHoverLine();
    };

    $scope.toggleEditableElement = false;

    //TODO Refactor
    $scope.updateElement = function() {

        var fieldInList = $scope.record[$scope.treeElement][$scope.getIndex($scope.record, $scope.treeElement, $scope.node[$scope.hierarchyOptions.elementNoFld])];

        //cancel if nothing has changed

        var testForChange = angular.copy(fieldInList);
        delete testForChange[$scope.hierarchyOptions.elementNoFld];
        delete testForChange[$scope.hierarchyOptions.parentFld];
        delete testForChange[$scope.hierarchyOptions.displayStatusFld];
        delete testForChange[$scope.hierarchyOptions.orderFld];
        delete testForChange[$scope.hierarchyOptions.isContainerFld];
        if (Object.keys(testForChange).length === 0) {
//        if (fieldInList.label === undefined && (fieldInList.dataType === undefined || fieldInList.dataType === "")) {
            return $scope.removeLine($scope.treeElement, fieldInList[$scope.hierarchyOptions.elementNoFld]);
        }

        $scope.toggleEditableElement = !$scope.toggleEditableElement;
    };

    $scope.editElement = function() {
        $scope.toggleEditableElement = !$scope.toggleEditableElement;
    };

    $scope.removeLine = function(model, elementNo) {
        if ($scope.node.content) { //its got children - do you want to delete them?
            $scope.$emit('showErrorMessage', {
                title: 'You can\'t do that',
                body: 'The element you are trying to delete has children. Please remove them first.'
            });
        } else {
            var index = $scope.getIndex($scope.record, model, elementNo);
            if (index !== -1) {
                $scope.remove(model, index);
            }
        }
    };

    $scope.addChild = function(ev, parent) {
        var arrayField = $scope.add();

        arrayField.push({
            elementNo: $scope.getNextElementNo(arrayField),
            parent: parent

        });
        $scope.toggleChildren(true);
    };
})
    .directive('fngHierarchyChild', function($compile) {
        return {
            restrict: 'E',
            replace: true,
            controller: 'fngHierarchyChildCtrl',
            compile: function() {
                return {
                    post: function(scope, element, attrs) {
                        var template =
                            '<div class="hierarchy-list clearfix" jqyoui-draggable="{animate:true}" data-drag="true" data-jqyoui-options="{revert: true}">' +
                                '<div ng-switch="toggleEditableElement">' +
                                    '<div ng-switch-when="true" ng-class= "{hoverindicator: hoverLine}" data-drop="true" jqyoui-droppable="{animate:true, onDrop: \'onDrop\', onOver: \'onOver\', onOut: \'onOut\'}"> ' +
                                        '<span class="name">' +
                                            '<i class="{{iconType}}" ng-click="toggleChildren()"></i>' +
                                            '<span>{{ getHierarchyLabel(node) }}</span>' +
                                        '</span>' +
                                        '<span class="hierarchy-controls">' +
                                            '<span ng-if="node.isContainer">' +
                                                '<i class="icon-plus-sign" ng-click="addChild($event, node[' + scope.hierarchyOptions.elementNoFld + '])"></i>' +
                                            '</span>' +
                                            //call to removeLine
                                            '<i class="icon-minus-sign" ng-click="removeLine(treeElement, node[' + scope.hierarchyOptions.elementNoFld + '])"></i>' +
                                            '<span ng-if="!node.isContainer">' +
                                                '<i class="icon"></i>' +
                                            '</span>' +
                                            '<i class="icon-edit" ng-click="editElement()"></i>' +
                                        '</span>' +
                                    '</div>' +
                                    '<div ng-switch-when="false">' +
                                        '<ng-form class="form-inline">' +
                                            '<form-input schema="{{schemaName}}" subschema="true" elementNo="{{node[' + scope.hierarchyOptions.elementNoFld + ']}}" index={{index}} formstyle="inline"></form-input>' +
                                            '<button class="btn btn-mini btn-warning form-btn pull-right" ng-click="updateElement()">Done</button>' +
                                        '</ng-form>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="children" ng-if="node.content">' +
                                    '<span ng-if="node.content != undefined">' +
                                        '<span ng-switch="toggleChildElement">' +
                                            '<span ng-switch-when="true">' +
                                                '<fng-hierarchy-child ng-repeat=\'node in node.content\'></fng-hierarchy-child>' +
                                            '</span>' +
                                        '</span>' +
                                    '</span>' +
                                '</div>' +
                            '</div>';

                        var $template = angular.element(template);
                        $compile($template)(scope);
                        element.append($template);
                        scope.$watch('toggleEditableElement', function(newValue, oldValue, scope) {
                            if (newValue !== oldValue) {
                                scope.toggleFolderIcon();
                            }
                        });
                    }
                }
            }
        };
    });