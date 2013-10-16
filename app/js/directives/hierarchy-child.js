formsAngular

.directive('fngHierarchyChild', function($compile, ngDragDropService, $timeout, utils) {

    return {

        restrict: 'E',

        replace: true,

        require: '^fngHierarchyList',

        controller: function($scope) {

            $scope.index = utils.getIndex($scope.record, $scope.model, $scope.field.elementNo);

            if ($scope.field.type === 'container') { 

                $scope.toggleChildElement = $scope.record[$scope.model][utils.getIndex($scope.record, $scope.model, $scope.field.elementNo)]['displayStatus'];

            }

            toggleFolderIcon();

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

            $scope.toggleChildren = function() {
                $scope.toggleChildElement = !$scope.toggleChildElement;

                //record the order for when initialising.

                $scope.record[$scope.model][utils.getIndex($scope.record, $scope.model, $scope.field.elementNo)]['displayStatus'] = $scope.toggleChildElement;

                toggleFolderIcon();

            }

            function reOrder(element, newPrevious) {

            }

            $scope.hoverLine = false;

            $scope.onDrop = function(event, ui) {

                var index, currentParent, newParentElementNo, childElementNo, dragged = ui.draggable.scope().field,
                    dropTarget = angular.element(event.target).scope().field,
                    newParentElementNo = dropTarget.elementNo,
                    childElementNo = dragged.elementNo,
                    childIndex = utils.getIndex($scope.record, $scope.model, childElementNo),
                    currentParent = $scope.record[$scope.model][childIndex].parent,
                    dropTargetParent = $scope.record[$scope.model][utils.getIndex($scope.record, $scope.model, newParentElementNo)].parent;

                //if dropping onto a container, and the target is open, then move the element.
                if (dropTarget.type === 'container' && angular.element(event.target).scope().toggleChildElement === true) {

                    if (currentParent !== newParentElementNo) {

                        $scope.record[$scope.model][childIndex].parent = newParentElementNo;

                    } else {

                        //re-number the higher elements

                        dragged.order = dropTarget.order + 1;

                        var reOrderStartIndex;

                        for (var i = 0; i < dropTarget.parentReference.length; i++) {
                            if (dropTarget.parentReference[i].elementNo === dropTarget.elementNo) { //move
                                reOrderStartIndex = i + 1;
                                break;
                            }
                        }

                        for (var i = reOrderStartIndex; i < dropTarget.parentReference.length; i++) {

                            dropTarget.parentReference[i].order = dropTarget.parentReference[i].order + 1;

                        }

                        utils.updateOrder($scope);
                    }

                } else if (currentParent === dropTargetParent) {

                    //re-number the higher elements

                    dragged.order = dropTarget.order + 1;

                    var reOrderStartIndex;

                    for (var i = 0; i < dropTarget.parentReference.length; i++) {
                        if (dropTarget.parentReference[i].elementNo === dropTarget.elementNo) { //move
                            reOrderStartIndex = i + 1;
                            break;
                        }
                    }

                    for (var i = reOrderStartIndex; i < dropTarget.parentReference.length; i++) {

                        dropTarget.parentReference[i].order = dropTarget.parentReference[i].order + 1;

                    }
                    utils.updateOrder($scope);
                }

                $scope.parsePath();

                $scope.hoverLine = !$scope.hoverLine;

                $scope.$apply();

            }


            $scope.onOver = function(event, ui) {

                var droppable = angular.element(event.target).scope().field,
                    draggable = ui.draggable.scope().field,
                    childElementNo = draggable.elementNo,
                    index = utils.getIndex($scope.record, $scope.model, childElementNo),
                    currentParent = $scope.record[$scope.model][index].parent //TODO here HARD CODED Hierarchy!!!!!
                    ,
                    newParentElementNo = droppable.elementNo;

                //if same level (same parent, then move it

                if (droppable.type !== 'container') {

                }

                $scope.hoverLine = !$scope.hoverLine;

                $scope.$apply();

            }


            $scope.onOut = function(event, ui) {

                var droppable = angular.element(event.target).scope().field,
                    draggable = ui.draggable.scope().field,
                    childElementNo = draggable.elementNo,
                    index = utils.getIndex($scope.record, $scope.model, childElementNo),
                    currentParent = $scope.record[$scope.model][index].parent //TODO here!
                    ,
                    newParentElementNo = droppable.elementNo;

                $scope.hoverLine = !$scope.hoverLine;

                $scope.$apply();
            }



            $scope.toggleEditableElement = ($scope.field.name !== '' ? true : false);

            $scope.updateElement = function() {

                //check if this is container with children.
                //if so don't allow change from container

                if ($scope.field.content) {

                }

                $scope.parsePath();

                $scope.toggleEditableElement = !$scope.toggleEditableElement;

            }

            $scope.editElement = function() {

                $scope.toggleEditableElement = !$scope.toggleEditableElement;

            }

            $scope.removeLine = function(model, elementNo) {

                var record = $scope.record,
                    index = -1,
                    proceed;

                if ($scope.field.content) { //its got children - do you want to delete them?
                    proceed = false;

                    $scope.$emit('showErrorMessage', {
                        title: 'You can\'t do that',
                        body: 'The element you are trying to delete has children. Please remove them first.'
                    });

                } else {
                    proceed = true;
                }

                if (proceed) {

                    index = utils.getIndex($scope.record, model, elementNo)

                    if (index !== -1) {
                        $scope.remove(model, index);
                    };
                }
            }

            $scope.addChild = function(ev, parent) {

                var arrayField = $scope.add();

                arrayField.push({
                    elementNo: $scope.getNextElementNo(arrayField),
                    parent: parent

                });
            }
        },

        compile: function(tElement, tAttrs, transclude) {

            return {
                post: function(scope, element, attrs) {

                    var template =
                        '<div class="hierarchy-list {{field.dataType}}" ' +
                        'jqyoui-draggable="{animate:true}" data-drag="true" data-jqyoui-options="{revert: true}">' +
                        '<div ng-switch on="toggleEditableElement">' +
                        '<div ng-switch-when="true" ng-class= "{hoverindicator: hoverLine}" data-drop="true" jqyoui-droppable="{animate:true, onDrop: \'onDrop\', onOver: \'onOver\', onOut: \'onOut\'}"> ' +
                        '<span class="name"><i class="{{iconType}}" ng-click="toggleChildren()"></i>{{field.name}}</span>' +

                    '<span class="controls">' +
                        '<span ng-if="field.type == \'container\'">' +
                        '<i class="icon-plus-sign" ng-click="addChild($event, field.elementNo)"></i>' +
                        '</span>' +
                    //call to removeLine
                    '<i class="icon-minus-sign" ng-click="removeLine(\'{{model}}\', {{field.elementNo}})"></i>' +
                        '<span ng-if="field.type != \'container\'">' +
                        '<i class="icon"></i>' +
                        '</span>' +
                        '<i class="icon-edit" ng-click="editElement()"></i>' +
                        '</span>' +
                        '</div>' +
                        '<div ng-switch-when="false">' +
                        '<form-input schema="{{schemaName}}" subschema="true" elementNo="{{field.elementNo}}" index={{index}}></form-input>' +
                        '<button btn ng-click="updateElement()">done</button>' +
                        '</div>' +
                        '</div>' +
                        '<div class="children" ng-if="field.content">' +
                        '<span ng-if="field.content != undefined">' +
                        '<span ng-switch on="toggleChildElement">' +
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
                }
            }
        }
    };
});