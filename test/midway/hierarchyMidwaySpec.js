describe('fng-hierarchy', function () {

    var ctrl, elm, scope, $httpBackend, ngDragDropService, $timeout, recordData, formSchema, schemaHierarchy, hierarchy, $compile, $templateCache, template;

    beforeEach(function () {

        angular.mock.module('formsAngular');
        angular.mock.module('app/template/hierarchy-master.html');
        inject(function (_utils_) {
            // module('ngDragDrop');
            recordData = {
                "Name": "test2",
                "_id": "524e73ae7d7f3c9047000005",
                "Hierarchy": [
                    {
                        "elementNo": 0,
                        "name": "This_is_a_new_hierarchy1",
                        "dataType": "container",
                        "order": 0,
                        "displayStatus": true,
                        "label": "This is a new hierarchy1"
                    },
                    {
                        "elementNo": 1,
                        "name": "lowerf",
                        "label": "lowerf",
                        "dataType": "text",
                        "parent": 0,
                        "order": 7
                    },
                    {
                        "elementNo": 2,
                        "name": "secon",
                        "label": "secon",
                        "order": 5
                    },
                    {
                        "elementNo": 5,
                        "name": "sdsdf",
                        "label": "sdsdf",
                        "dataType": "text",
                        "order": 8
                    },
                    {
                        "elementNo": 6,
                        "name": "but",
                        "label": "but",
                        "dataType": "text",
                        "parent": 0,
                        "order": 6
                    },
                    {
                        "elementNo": 7,
                        "name": "yot1dddd",
                        "label": "ttt",
                        "dataType": "container",
                        "order": 1,
                        "displayStatus": true
                    },
                    {
                        "elementNo": 9,
                        "parent": 7,
                        "name": "second1",
                        "order": 14,
                        "label": "ttt"
                    },
                    {
                        "elementNo": 15,
                        "order": 3,
                        "label": "just this thingdfdfdff",
                        "dataType": "textarea",
                        "name": "just_this_thingdfdfdff"
                    }
                ]
            };

            schemaHierarchy = [
                {
                    "name": "Hierarchy.name",
                    "id": "f_Hierarchy.name",
                    "label": "Name",
                    "type": "text",
                    "required": true,
                    "form": {
                        "hidden": "true"
                    }
                },
                {
                    "name": "Hierarchy.label",
                    "id": "f_Hierarchy.label",
                    "label": "Label",
                    "type": "text"
                },
                {
                    "name": "Hierarchy.dataType",
                    "id": "f_Hierarchy.dataType",
                    "label": "Data Type",
                    "type": "select",
                    "options": "f_Hierarchy_dataTypeOptions"
                }
            ];

            hierarchy = _utils_.createFormSchema(recordData.Hierarchy);

        });

    });


    describe('Integration tests', function () {

        beforeEach(function () {
            inject(function ($rootScope, $controller, _$compile_, _$httpBackend_, _$templateCache_) {

                $httpBackend = _$httpBackend_;
                scope = $rootScope;

                scope.remove = function () {
                    scope.record.Hierarchy.pop();
                };

                $compile = _$compile_;
                $templateCache = _$templateCache_;


                scope.record = recordData;

                // scope.formSchema = formSchema;

                scope.__schema_Hierarchy = schemaHierarchy;

                $httpBackend.whenGET('/template/hierarchy-master.html').respond($templateCache.get('app/template/hierarchy-master.html'));
                template = '<fng-hierarchy-list data-record="record.Hierarchy" data-schema="__schema_Hierarchy"></fng-hierarchy-list>';
                elm = angular.element(template);
                $compile(elm)(scope);
                scope.$digest();
                $httpBackend.flush();
            });
        });


        describe('initial state', function () {

            it('should load the template', function () {

                $httpBackend.expectGET('/template/hierarchy-master.html');

            });

            it('should load child hierarchy', function () {

                var el = elm.find('.hierarchy-list');
                expect(el.length).toBe(8);
                for (var i = 0 ; i < 2; i++) {
                    el = angular.element(elm.find('.hierarchy-list')[i]);
                }
            });

        });

        describe('actions', function () {
            it('should remove a hierarchy element', function () {
                var el = elm.find('i.icon-minus-sign');

                expect(el.length).toBe(8);
                $(el[2]).click();
                el = elm.find('i.icon-minus-sign');
                expect(el.length).toBe(7);

            });

            it('should not remove a hierarchy element if it has children', function () {

                var el = elm.find('i.icon-minus-sign');


                expect(el.length).toBe(8);
                $(el[0]).click();
                el = elm.find('i.icon-minus-sign');
                expect(el.length).toBe(8);

            });

            it('should add a new entry form when clicking add', function () {

                var el = elm.find('input');
                expect(el.length).toBe(0);
                var add = elm.find('.icon-plus-sign');
                $(add[1]).click();
                el = elm.find('input');
                expect(el.length).toBe(2);

            });

            it('should display a form when clicking edit', function () {

                var el = elm.find('input');
                expect(el.length).toBe(0);
                var edit = elm.find('.icon-edit');
                $(edit[0]).click();
                el = elm.find('input');
                expect(el.length).toBe(2);

            });


            it('should return the correct elementNo when adding a new element', function () {

                var el = elm.find('input');
                expect(el.length).toBe(0);
                var add = elm.find('.icon-plus-sign');
                //second element in declaration above has highest elementNo.
                var highestElementNo = 15;
                $(add[add.length - 1]).click();
                expect(scope.record.Hierarchy[scope.record.Hierarchy.length - 1].elementNo).toBe(highestElementNo + 1);
            });

            it('should emit showErrorMessage event if you try to delete a container with children', function () {


                spyOn(scope, "$emit");

                var remove = elm.find('.icon-minus-sign');

                $(remove[0]).click();

                expect(scope.$emit).toHaveBeenCalledWith('showErrorMessage', {
                    title: 'You can\'t do that',
                    body: 'The element you are trying to delete has children. Please remove them first.'
                });
            });

            it('display the correct icon if a new container is added', function () {

                var plusIcon = elm.find('.icon-plus-sign');

                expect(elm.find('.icon-folder-close').length).toEqual(0);
                $(plusIcon[plusIcon.length - 1]).click();

                scope.record.Hierarchy[8].label = 'TestingLabel';
                scope.record.Hierarchy[8].name = 'TestingName';
                scope.record.Hierarchy[8].dataType = 'container';

                elm.find('button').click();
                elm = angular.element(template);
                $compile(elm)(scope);
                scope.$digest();
                expect(elm.find('.icon-folder-close').length).toEqual(1);


            });

            it('removes the edit form if done is clicked and nothing has been entered', function () {

                var plusIcon = elm.find('.icon-plus-sign');

                expect(elm.find('input').length).toEqual(0);

                $(plusIcon[plusIcon.length - 1]).click();

                expect(elm.find('input').length).toEqual(2);

                elm.find('button').click();

                expect(elm.find('input').length).toEqual(0);

            });

            describe('new form', function () {

                beforeEach(function () {

                    scope.record = {};

                    elm = angular.element(template);
                    $compile(elm)(scope);
                    scope.$digest();

                });

                it('shows an empty form', function () {

                    var plusIcon = elm.find('.icon-plus-sign');
                    expect(plusIcon.length).toEqual(1);

                });

                it('should $emit an error if trying to add an element before saving the name in the form', function () {

                    spyOn(scope, "$emit");
                    expect(elm.find('input').length).toBe(0);
                    elm.find('.icon-plus-sign').click();
                    expect(scope.$emit).toHaveBeenCalledWith('showErrorMessage', {
                        title: 'You can\'t do that',
                        body: 'You need to provide a name and then save it before adding any elements.'
                    });
                });
            });
        });
    });
});

describe('formsAngular hierarchy tests', function () {

    var $httpBackend, $rootScope, $controller, $location, $compile, elm, template;

    beforeEach(function () {

        angular.mock.module('formsAngular');
        angular.mock.module('app/template/hierarchy-master.html');

    });

    describe('creating a new hierarchy', function () {


        beforeEach(function () {
            inject(function (_$httpBackend_, _$rootScope_, _$controller_, _$location_, _$compile_, _$templateCache_) {
                $httpBackend = _$httpBackend_;
                $rootScope = _$rootScope_;
                $controller = _$controller_;
                $location = _$location_;
                $compile = _$compile_;
                $templateCache = _$templateCache_;
                scope = $rootScope;

                $httpBackend.whenGET('/template/hierarchy-master.html').respond($templateCache.get('app/template/hierarchy-master.html'));

                $httpBackend.whenGET('api/schema/j_hierarchy_forms').respond({
                    "Name": {
                        "enumValues": [],
                        "regExp": null,
                        "path": "Name",
                        "instance": "String",
                        "validators": [
                            [null, "required"]
                        ],
                        "setters": [],
                        "getters": [],
                        "options": {
                            "required": true,
                            "index": true,
                            "list": {}
                        },
                        "_index": true,
                        "isRequired": true,
                        "$conditionalHandlers": {}
                    },
                    "Hierarchy": {
                        "schema": {
                            "elementNo": {
                                "path": "elementNo",
                                "instance": "Number",
                                "validators": [
                                    [null, "required"]
                                ],
                                "setters": [],
                                "getters": [],
                                "options": {
                                    "required": true,
                                    "form": {
                                        "label": "Element No",
                                        "hidden": true
                                    }
                                },
                                "_index": null,
                                "isRequired": true,
                                "$conditionalHandlers": {}
                            },
                            "parent": {
                                "path": "parent",
                                "instance": "Number",
                                "validators": [],
                                "setters": [],
                                "getters": [],
                                "options": {
                                    "form": {
                                        "hidden": true
                                    }
                                },
                                "_index": null,
                                "$conditionalHandlers": {}
                            },
                            "name": {
                                "enumValues": [],
                                "regExp": null,
                                "path": "name",
                                "instance": "String",
                                "validators": [
                                    [null, "required"]
                                ],
                                "setters": [],
                                "getters": [],
                                "options": {
                                    "required": true,
                                    "form": {
                                        "hidden": true
                                    }
                                },
                                "_index": null,
                                "isRequired": true,
                                "$conditionalHandlers": {}
                            },
                            "label": {
                                "enumValues": [],
                                "regExp": null,
                                "path": "label",
                                "instance": "String",
                                "validators": [],
                                "setters": [],
                                "getters": [],
                                "options": {},
                                "_index": null,
                                "$conditionalHandlers": {}
                            },
                            "order": {
                                "path": "order",
                                "instance": "Number",
                                "validators": [],
                                "setters": [],
                                "getters": [],
                                "options": {
                                    "form": {
                                        "hidden": true
                                    }
                                },
                                "_index": null,
                                "$conditionalHandlers": {}
                            },
                            "displayStatus": {
                                "path": "displayStatus",
                                "instance": "boolean",
                                "validators": [],
                                "setters": [],
                                "getters": [],
                                "options": {
                                    "form": {
                                        "hidden": true
                                    }
                                },
                                "_index": null
                            },
                            "dataType": {
                                "enumValues": ["text", "textarea", "container", "array"],
                                "regExp": null,
                                "path": "dataType",
                                "instance": "String",
                                "validators": [
                                    [null, "enum"]
                                ],
                                "setters": [],
                                "getters": [],
                                "options": {
                                    "enum": ["text", "textarea", "container", "array"]
                                },
                                "_index": null,
                                "$conditionalHandlers": {}
                            }
                        },
                        "options": {
                            "form": {
                                "hierarchy": true
                            }
                        }
                    },
                    "_id": {
                        "path": "_id",
                        "instance": "ObjectID",
                        "validators": [],
                        "setters": [null],
                        "getters": [],
                        "options": {
                            "auto": true
                        },
                        "_index": null,
                        "$conditionalHandlers": {}
                    }
                });
                $location.$$path = '/j_hierarchy_forms/new';
                ctrl = $controller("BaseCtrl", {
                    $scope: scope
                });

                template = angular.element(
                    '<form name="myForm" class="form-horizontal compact">' +
                        '<form-input schema="formSchema"></form-input>' +
                        '</form>');

                scope.formSchema = [
                    {
                        "name": "Name",
                        "id": "f_Name",
                        "label": " Name",
                        "type": "text",
                        "required": true,
                        "add": "autofocus "
                    },
                    {
                        "hierarchy": true,
                        "name": "Hierarchy",
                        "id": "f_Hierarchy",
                        "label": " Hierarchy",
                        "schema": [
                            {
                                "name": "Hierarchy.label",
                                "id": "f_Hierarchy.label",
                                "label": "Label",
                                "type": "text"
                            },
                            {
                                "name": "Hierarchy.dataType",
                                "id": "f_Hierarchy.dataType",
                                "label": "Data Type",
                                "type": "select",
                                "options": "f_Hierarchy_dataTypeOptions"
                            }
                        ]
                    }
                ];
                elm = $compile(template)(scope);
                scope.$digest();
                $httpBackend.flush();

            });

        });

        it('should load the new hierarchy screen', function () {

            //using undocumented $$childHead to access child scope - this might be a bit fragile.
            expect(scope.$$childHead.hoverLine).toBeDefined();
        });

        it('should display a blank input box', function () {
            expect(elm.find('input')).toBeDefined();
        });

        it('should only show a single plus icon', function () {
            expect(elm.find('.icon-plus-sign').length).toEqual(1);
        });
    });

});

