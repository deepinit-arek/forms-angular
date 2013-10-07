formsAngular

.directive('fngHierarchyChild', function($compile, ngDragDropService) {

    return {

        restrict: 'E',

        replace: true,

        compile: function(tElement, tAttrs, transclude) {

            return {
                post: function(scope, element, attrs) {

                    var template =
                        '<div class="hierarchy-list {{field.dataType}}" jqyoui-droppable="{animate:true}" jqyoui-draggable="{animate:true}" data-drop="true" data-drag="true" data-jqyoui-options="{revert: true}">' +
                        '<div ng-switch on="toggleCPElement">' +
                        '<div ng-switch-when="true">' +
                        '<span class="name"><i class="{{iconType}}"></i>{{field.name}}</span>' +
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
                        '<i class="icon-move" data-drag="true"></i>' +
                        '</span>' +
                        '<div ng-switch on="toggleChildElement">' +
                        '<div ng-switch-when="true">' +
                        '<!-- <fng-hierarchy-list data-record="test" data-child="true"></fng-hierarchy-list> -->' +
                        '<!-- <fng-hierarchy-child ng-repeat=\'field in field.content\' track by elementNo></fng-hierarchy-child> -->' +
                        '<button btn ng-click="saveElement()">done</button>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div ng-switch-when="false">' +
                        '<form-input schema="{{schemaName}}" subschema="true" elementNo="{{field.elementNo}}"></form-input>' +
                        '<button btn ng-click="updateElement()">done</button>' +
                        '</div>' +
                        '</div>' +
                        '<div class="children" ng-if="field.content">' +
                        '<span ng-if="field.content != undefined">' +
                        '<fng-hierarchy-child ng-repeat=\'field in field.content\' track by elementNo></fng-hierarchy-child>' +
                        '</span>' +
                        '</div>' +
                        '</div>';

                    var $template = angular.element(template);
                    $compile($template)(scope);
                    element.append($template);

                    function getIndex(model, elementNo) {

                        var record = scope.record,
                            index = -1;

                        for (var i = 0; i < record[model].length; i++) {
                            if (record[model][i]['elementNo'] === elementNo) {
                                return i;
                            }
                        }

                    }

                    scope.toggleCPElement = (scope.field.name !== '' ? true : false);

                    scope.updateElement = function() {

                        scope.parsePath();

                        scope.toggleCPElement = !scope.toggleCPElement;

                    }

                    scope.editElement = function() {

                        scope.toggleCPElement = !scope.toggleCPElement;

                    }

                    scope.removeLine = function(model, elementNo) {

                        var record = scope.record,
                            index = -1;

                        //find index

                        for (var i = 0; i < record[model].length; i++) {
                            if (record[model][i]['elementNo'] === elementNo) {
                                index = i;
                                break;
                            }
                        }

                        if (index !== -1) {
                            scope.remove(model, index);
                        };

                    }

                    scope.updateView = function() {

                        if (scope.$last) {

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