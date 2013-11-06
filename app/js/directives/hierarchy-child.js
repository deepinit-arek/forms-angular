formsAngular

.controller('fngHierarchyChildCtrl', function($scope, utils) {

    $scope.index = utils.getIndex($scope.record, $scope.model, $scope.field.elementNo);

    $scope.hoverLine = false;

    if ($scope.field.type === 'container') {
        $scope.toggleChildElement = $scope.record[$scope.model][utils.getIndex($scope.record, $scope.model, $scope.field.elementNo)]['displayStatus'];
    }

    function toggleFolderIcon() {
        if ($scope.field.type === 'container') {
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
        $scope.record[$scope.model][utils.getIndex($scope.record, $scope.model, $scope.field.elementNo)]['displayStatus'] = $scope.toggleChildElement;
        toggleFolderIcon();
    };

    $scope.toggleHoverLine = function() {
        $scope.hoverLine = !$scope.hoverLine;
        $scope.$apply();
    };

    $scope.onDrop = function(event, ui) {

        var dragged = ui.draggable.scope().field,
            dropTarget = angular.element(event.target).scope().field,
            newParentElementNo = dropTarget.elementNo,
            childElementNo = dragged.elementNo,
            childIndex = utils.getIndex($scope.record, $scope.model, childElementNo),
            currentParent = $scope.record[$scope.model][childIndex].parent,
            dropTargetParent = $scope.record[$scope.model][utils.getIndex($scope.record, $scope.model, newParentElementNo)].parent,
            reOrderStartIndex,
            i;

        function renumberHigherElements() {
            for (i = 0; i < dropTarget.parentReference.length; i++) {
                if (dropTarget.parentReference[i].elementNo === dropTarget.elementNo) { //move
                    reOrderStartIndex = i + 1;
                    break;
                }
            }
            for (i = reOrderStartIndex; i < dropTarget.parentReference.length; i++) {
                dropTarget.parentReference[i].order = dropTarget.parentReference[i].order + 1;
            }
            dragged.order = dropTarget.order + 1;
            utils.updateOrder($scope);
        }

        //if dropping onto a container, and the target is open, then move the element.
        if (dropTarget.type === 'container' && angular.element(event.target).scope().toggleChildElement === true) {
            if (currentParent !== newParentElementNo) {
                $scope.record[$scope.model][childIndex].parent = newParentElementNo;
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

    $scope.toggleEditableElement = ($scope.field.name !== '' ? true : false);

    //TODO Refactor
    $scope.updateElement = function() {

        var fieldInList = $scope.record[$scope.model][utils.getIndex($scope.record, $scope.model, $scope.field.elementNo)];

        //cancel if nothing has changed

        if (fieldInList.label === undefined && (fieldInList.dataType === undefined || fieldInList.dataType === "")) {
            return $scope.removeLine($scope.model, fieldInList.elementNo);
        }

        if (fieldInList.label === undefined) {

            $scope.$emit('showErrorMessage', {
                title: 'You can\'t do that',
                body: 'You need to give it a name!'
            });

        } else {


//            fieldInList.name = fieldInList.label.replace(/ /g, "_");
            $scope.field.label = fieldInList.label;
            $scope.field.name = fieldInList.name;  //label.replace(/ /g, "_");
            $scope.field.type = fieldInList.dataType;

            $scope.toggleEditableElement = !$scope.toggleEditableElement;

            //check if this is container with children.
            //if so don't allow change from container

            if (!($scope.field.content === undefined || $scope.field.content.length < 1) && fieldInList.dataType !== "container") {

                $scope.field.type = fieldInList.dataType = "container";

                $scope.$emit('showErrorMessage', {
                    title: 'You can\'t do that',
                    body: 'The element you are trying to amend has children. It can only be a container.'
                });
            }
        }

    };

    $scope.editElement = function() {
        $scope.toggleEditableElement = !$scope.toggleEditableElement;
    };

    $scope.removeLine = function(model, elementNo) {
        if ($scope.field.content) { //its got children - do you want to delete them?
            $scope.$emit('showErrorMessage', {
                title: 'You can\'t do that',
                body: 'The element you are trying to delete has children. Please remove them first.'
            });
        } else {
            var index = utils.getIndex($scope.record, model, elementNo);
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
                    post: function(scope, element) {
                        var template =
                            '<div class="hierarchy-list {{field.dataType}}" jqyoui-draggable="{animate:true}" data-drag="true" data-jqyoui-options="{revert: true}">' +
                                '<div ng-switch="toggleEditableElement">' +
                                    '<div ng-switch-when="true" ng-class= "{hoverindicator: hoverLine}" data-drop="true" jqyoui-droppable="{animate:true, onDrop: \'onDrop\', onOver: \'onOver\', onOut: \'onOut\'}"> ' +
                                        //TODO better to use ng-class, but it's quite inpenetrable for three value conditional
                                        // '<span class="name"><i class="{{field.type == \'container\' && ({toggleChildElement && (\'icon-folder-close\') || (\'icon-folder-open\')}) || (\'icon-file\')}}" ng-click="toggleChildren()"></i>{{field.label}}</span>' +
                                        // '<span class="name"><i ng-class="{\'icon-file\': field.type !==\'container\' && (\'icon-folder-close\': !toggleChildElement, \'icon-folder-open\': toggleChildElement)}" ng-click="toggleChildren()"></i>{{field.label}}</span>' +
                                        '<span class="name"><i class="{{iconType}}" ng-click="toggleChildren()"></i>{{field.label}}</span>' +
                                        '<span class="hierarchy-controls">' +
                                            '<span ng-if="field.type == \'container\'">' +
                                                '<i class="icon-plus-sign" ng-click="addChild($event, field.elementNo)"></i>' +
                                            '</span>' +
                                            //call to removeLine
                                            '<i class="icon-minus-sign" ng-click="removeLine(model, field.elementNo)"></i>' +
                                            '<span ng-if="field.type != \'container\'">' +
                                                '<i class="icon"></i>' +
                                            '</span>' +
                                            '<i class="icon-edit" ng-click="editElement()"></i>' +
                                        '</span>' +
                                    '</div>' +
                                    '<div ng-switch-when="false">' +
                                        '<ng-form class="form-inline">' +
                                            '<button class="btn btn-mini btn-warning form-btn pull-right" ng-click="updateElement()">done</button>' +
                                            '<form-input schema="{{schemaName}}" subschema="true" elementNo="{{field.elementNo}}" index={{index}} formstyle="inline"></form-input>' +
                                        '</ng-form>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="children" ng-if="field.content">' +
                                    '<span ng-if="field.content != undefined">' +
                                        '<span ng-switch="toggleChildElement">' +
                                            '<span ng-switch-when="true">' +
                                                '<fng-hierarchy-child ng-repeat=\'field in field.content\'></fng-hierarchy-child>' +
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