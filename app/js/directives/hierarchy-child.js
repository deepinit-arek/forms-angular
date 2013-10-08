formsAngular

.directive('fngHierarchyChild', function($compile, ngDragDropService) {

    return {

        restrict: 'E',

        replace: true,

        // controller: function ($scope, $element, $attrs, $transclude) {

        //    console.log($scope.hier);
        //    console.log($scope.hier[0].content);

        //     $scope.myTestfunction = function () {
        //         var a = 10;
        //     }
        // },

        compile: function(tElement, tAttrs, transclude) {

            return {
                post: function(scope, element, attrs) {

                    var template =
                        '<div class="hierarchy-list {{field.dataType}}" ' +
                        'jqyoui-draggable="{animate:true}" data-drag="true" data-jqyoui-options="{revert: true}">' +
                            '<div ng-switch on="toggleEditableElement">' +
                                '<div ng-switch-when="true" ng-class= "{hoverindicator: hoverLine}" data-drop="true" jqyoui-droppable="{animate:true, onDrop: \'onDrop\', onOver: \'onOver\', onOut: \'onOut\'}"> ' +
                                    '<span class="name"><i class="{{iconType}}" ng-click="toggleChildren()"></i>{{field.name}}</span>' +
                                    '<span class="label">' +
                                        '<span ng-if="field.label.length > 0">{{field.label}}</span>' +
                                        '<span ng-if="field.label == undefined">empty</span>' +
                                    '</span>' +
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
                                        '<span ng-switch-when="true" ui-sortable ng-model="field.content">' +
                                            '<fng-hierarchy-child ng-repeat=\'field in field.content\'></fng-hierarchy-child>' +
                                        '</span>' +
                                    '</span>' +
                                '</span>' +
                            '</div>' +
                        '</div>';

                    var $template = angular.element(template);
                    $compile($template)(scope);
                    element.append($template);

                    scope.index = scope.getIndex(scope.model, scope.field.elementNo);

                    scope.toggleChildElement = true;

                    toggleFolderIcon();

                    function toggleFolderIcon() {

                        if (scope.field.type === 'container') {

                            if (scope.toggleChildElement === true) {
                                scope.iconType = 'icon-folder-open';
                            } else {
                                scope.iconType = 'icon-folder-close';
                            }

                    } else {
                        scope.iconType = 'icon-file';
                    }

                }

                    scope.toggleChildren = function () {
                        scope.toggleChildElement =  !scope.toggleChildElement;
                        toggleFolderIcon();

                    }

                    

                    scope.hoverLine = false;

                    scope.onDrop = function(event, ui) {

                        var element = angular.element(event.target).scope().field;

                        var newParentElementNo = element.elementNo;

                        if (element.type === 'container') {

                            var childElementNo = ui.draggable.scope().field.elementNo
                            , index = scope.getIndex('Hierarchy', childElementNo)
                            , currentParent = scope.record.Hierarchy[index].parent;

                            if (currentParent !== newParentElementNo) {

                                scope.record.Hierarchy[index].parent = newParentElementNo;
                                scope.parsePath();

                                scope.hoverLine = !scope.hoverLine;

                                scope.$apply();

                            }
                        }
                    }

                    scope.onOver = function(event, ui) {

                        var droppable = angular.element(event.target).scope().field
                        , draggable = ui.draggable.scope().field
                        , childElementNo = draggable.elementNo
                        , index = scope.getIndex('Hierarchy', childElementNo)
                        , currentParent = scope.record.Hierarchy[index].parent //TODO here!
                        , newParentElementNo = droppable.elementNo;


                        if (droppable.type === 'container' && currentParent !== newParentElementNo) {

                                scope.hoverLine = !scope.hoverLine;

                                scope.$apply();

                            }
                        }

                    scope.onOut = function(event, ui) {

                        var droppable = angular.element(event.target).scope().field
                        , draggable = ui.draggable.scope().field
                        , childElementNo = draggable.elementNo
                        , index = scope.getIndex('Hierarchy', childElementNo)
                        , currentParent = scope.record.Hierarchy[index].parent //TODO here!
                        , newParentElementNo = droppable.elementNo;


                        if (droppable.type === 'container' && currentParent !== newParentElementNo) {

                                scope.hoverLine = !scope.hoverLine;

                                scope.$apply();

                            }
                        }

                    

                    scope.toggleEditableElement = (scope.field.name !== '' ? true : false);

                    scope.updateElement = function() {

                        //check if this is container with children.
                        //if so don't allow change from container

                        scope.parsePath();

                        scope.toggleEditableElement = !scope.toggleEditableElement;

                    }

                    scope.editElement = function() {

                        // var index = scope.getIndex(scope.model, field.elementNo);

                        scope.toggleEditableElement = !scope.toggleEditableElement;

                    }

                    scope.removeLine = function(model, elementNo) {

                        var record = scope.record,
                            index = -1,
                            proceed;

                        if (scope.field.content) { //its got children - do you want to delete them?
                            proceed = false;

                            scope.$emit('showErrorMessage', {title: 'You can\'t do that', body: 'The element you are trying to delete has children. Please remove them first.'});

                        } else {
                            proceed = true;
                        }

                        if (proceed) {

                            index = scope.getIndex(model, elementNo)

                            if (index !== -1) {
                                scope.remove(model, index);
                            };

                        }

                    }

                    scope.addChild = function(ev, parent) {

                        var arrayField = scope.add();

                        arrayField.push({
                            elementNo: scope.getNextElementNo(arrayField),
                            parent: parent

                        });
                    }
                }
            }
        }
    };
});