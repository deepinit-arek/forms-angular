formsAngular

.directive('faHierarchyChild', function($compile) {

    return {

        // templateUrl: '/template/hierarchy-child.html',


        restrict: 'E',

        replace: true,

        compile: function(tElement, tAttrs, transclude) {

            return {
                pre: function(scope, element, attrs) {

                },

                post: function(scope, element, attrs) {


                	var template = 
                	'<div class="hierarchy-list {{field.dataType}}">' +
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
                	'<i class="icon-move"></i>' +
                	'</span>' +
                	'<div ng-switch on="toggleChildElement">' +
                	'<div ng-switch-when="true">' +
                	'<!-- <fa-hierarchy-list data-record="test" data-child="true"></fa-hierarchy-list> -->' +
                	'<!-- <fa-hierarchy-child ng-repeat=\'field in field.content\' track by elementNo></fa-hierarchy-child> -->' +
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
                	'<fa-hierarchy-child ng-repeat=\'field in field.content\' track by elementNo></fa-hierarchy-child>' +
                	// '<div ng-repeat=\'field in field.content\' field=\'field.content\'>' +
                	// '<form-input schema="{{schemaName}}" subschema="true" elementNo="{{field.elementNo}}"></form-input>' +
                	// '<button btn ng-click="updateElement()">done</button>' +
                	// '</div>' +
                	'</span>' +
                	'</div>' +
                	'</div>';

                	 var $template = angular.element(template);
                	 $compile($template)(scope);
                	 element.append($template);

                	  





                    // scope.childSchema = attrs.schema + scope.parentName;

                    // scope.schema = attrs.schema + scope.parentName;
                    
                    // var template = '<form-input schema="'+ attrs.schema + scope.parentName + '" subschema="true"></form-input>';


                    // console.log(scope.field);

                    // element.html('<div class="test">{{field.name}}</div>');
                    // $compile(element.contents())(scope);


                    // var template = '<div class="test"></div>';

                    // var newElement = angular.element(template);
                    // $compile(newElement)(scope);
                    // element.replaceWith(newElement);



                    scope.toggleCPElement = (scope.field.name !== '' ? true : false);

                    // scope.parentName = 'CarePlan';

                    scope.updateElement = function() {

                    	scope.parsePath();

                        scope.toggleCPElement = !scope.toggleCPElement;


                    }

                    scope.editElement = function() {

                        scope.toggleCPElement = !scope.toggleCPElement;

                    }

                    // scope.$watch('field.dataType', function (newVal, oldVal) {
                    //     if (newVal === 'container') {
                    //         scope.iconType = 'icon-folder-close';
                    //     } else {
                    //         scope.iconType = 'icon-list';
                    //     }

                    // }, true);

                    scope.removeLine = function(model, elementNo) {

                        var record = scope.record
                        , index = -1;

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


                        //get the index of the the element

                        // scope.$apply(function () {

                        // scope.remove(parentName, index);
                        // scope.toggleShow();

                        // })

                        // scope.updateView();
                    }

                    scope.updateView = function() {

                        if (scope.$last) {

                        }

                        // $compile()(scope);

                        // $compile()



                    }

                    scope.addChild = function(ev, parent) {

                    	

                    	var arrayField = scope.add();

                    	arrayField.push({
                    		elementNo: arrayField.length,
                    		parent: parent

                    	});

                    	// scope.unwatchPath();

                    }

                    function getParentName() {
                        // return attrs.
                    }

                    
                }
            }
        }

    };
});