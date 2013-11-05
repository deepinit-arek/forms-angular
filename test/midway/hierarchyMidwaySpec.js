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
                        "dataType": "text",
                        "parent": 0,
                        "order": 7
                    },
                    {
                        "elementNo": 2,
                        "name": "secon",
                        "order": 5
                    },
                    {
                        "elementNo": 5,
                        "name": "sdsdf",
                        "dataType": "text",
                        "order": 8
                    },
                    {
                        "elementNo": 6,
                        "name": "but",
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

                scope.record.Hierarchy[8].name = 'TestingLabel';
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

describe('bigger data', function () {

    var ctrl, elm, scope, $httpBackend, ngDragDropService, $timeout, recordData, formSchema, schemaHierarchy, hierarchy, $compile, $templateCache, template;

    beforeEach(function () {

        angular.mock.module('formsAngular');
        angular.mock.module('app/template/hierarchy-master.html');
        inject(function (_utils_) {
            // module('ngDragDrop');
            recordData = {
                "Name": "test2",
                "_id": "524e73ae7d7f3c9047000005",
                "Hierarchy" : [
                    { 	"elementNo" : 0, 	"order" : 0, 	"name" : "title", 	"label" : "Title", 	"dataType" : "text" },
                    { 	"elementNo" : 1, 	"order" : 1, 	"name" : "forename", 	"label" : "Forename", 	"dataType" : "text" },
                    { 	"elementNo" : 2, 	"order" : 2, 	"name" : "surname", 	"label" : "Surname", 	"dataType" : "text" },
                    { 	"elementNo" : 3, 	"order" : 3, 	"name" : "dob", 	"label" : "Dob", 	"dataType" : "text" },
                    { 	"elementNo" : 4, 	"order" : 4, 	"name" : "landline", 	"label" : "Landline", 	"dataType" : "text" },
                    { 	"elementNo" : 5, 	"order" : 5, "name" : "street1", 	"label" : "Street1", 	"dataType" : "text" },
                    { 	"elementNo" : 6, 	"order" : 6, 	"name" : "street2", 	"label" : "Street2", 	"dataType" : "text" },
                    { 	"elementNo" : 7, 	"order" : 7, 	"name" : "town", 	"label" : "Town", 	"dataType" : "text" },
                    { 	"elementNo" : 8, 	"order" : 8, 	"name" : "county", 	"label" : "County", 	"dataType" : "text" },
                    { 	"elementNo" : 9, 	"order" : 9, 	"name" : "postcode", 	"label" : "Postcode", 	"dataType" : "text" },
                    { 	"elementNo" : 10, 	"order" : 10, 	"name" : "nok1.fullname", 	"label" : "Nok1 Fullname", 	"dataType" : "text" },
                    { 	"elementNo" : 11, 	"order" : 11, 	"name" : "nok1.address", 	"label" : "Nok1 Address", 	"dataType" : "text" },
                    { 	"elementNo" : 12, 	"order" : 12, 	"name" : "nok1.postcode", 	"label" : "Nok1 Postcode", 	"dataType" : "text" },
                    { 	"elementNo" : 13, 	"order" : 13, 	"name" : "nok1.landline", 	"label" : "Nok1 Landline", 	"dataType" : "text" },
                    { 	"elementNo" : 14, 	"order" : 14, 	"name" : "nok1.relationship", 	"label" : "Nok1 Relationship", 	"dataType" : "text" },
                    { 	"elementNo" : 15, 	"order" : 15, 	"name" : "nok2.fullname", 	"label" : "Nok2 Fullname", 	"dataType" : "text" },
                    { 	"elementNo" : 16, 	"order" : 16, 	"name" : "nok2.address", 	"label" : "Nok2 Address", 	"dataType" : "text" },
                    { 	"elementNo" : 17, 	"order" : 17, 	"name" : "nok2.postcode", 	"label" : "Nok2 Postcode", 	"dataType" : "text" },
                    { 	"elementNo" : 18, 	"order" : 18, 	"name" : "nok2.landline", 	"label" : "Nok2 Landline", 	"dataType" : "text" },
                    { 	"elementNo" : 19, 	"order" : 19, 	"name" : "nok2.relationship", 	"label" : "Nok2 Relationship", 	"dataType" : "text" },
                    { 	"elementNo" : 20, 	"order" : 20, 	"name" : "nok2.support", 	"label" : "Nok2 Support", 	"dataType" : "text" },
                    { 	"elementNo" : 21, 	"order" : 21, 	"name" : "gp.fullname", 	"label" : "Gp Fullname", 	"dataType" : "text" },
                    { 	"elementNo" : 22, 	"order" : 22, 	"name" : "gp.address", 	"label" : "Gp Address", 	"dataType" : "text" },
                    { 	"elementNo" : 23, 	"order" : 23, 	"name" : "gp.postcode", 	"label" : "Gp Postcode", 	"dataType" : "text" },
                    { 	"elementNo" : 24, 	"order" : 24, 	"name" : "gp.landline", 	"label" : "Gp Landline", 	"dataType" : "text" },
                    { 	"elementNo" : 25, 	"order" : 25, "name" : "gp.support", 	"label" : "Gp Support", 	"dataType" : "text" },
                    { 	"elementNo" : 26, 	"order" : 26, 	"name" : "health.fullname", 	"label" : "Health Fullname", 	"dataType" : "text" },
                    { 	"elementNo" : 27, 	"order" : 27, 	"name" : "health.address", 	"label" : "Health Address", 	"dataType" : "text" },
                    { 	"elementNo" : 28, 	"order" : 28, 	"name" : "health.postcode", 	"label" : "Health Postcode", 	"dataType" : "text" },
                    { 	"elementNo" : 29, 	"order" : 29, 	"name" : "health.telno", 	"label" : "Health Telno", 	"dataType" : "text" },
                    { 	"elementNo" : 30, 	"order" : 30, 	"name" : "health.relationship", 	"label" : "Health Relationship", 	"dataType" : "text" },
                    { 	"elementNo" : 31, 	"order" : 31, 	"name" : "health.support", 	"label" : "Health Support", 	"dataType" : "text" },
                    { 	"elementNo" : 32, 	"order" : 32, 	"name" : "sw.fullname", 	"label" : "Sw Fullname", 	"dataType" : "text" },
                    { 	"elementNo" : 33, 	"order" : 33, "name" : "sw.address", 	"label" : "Sw Address", 	"dataType" : "text" },
                    { 	"elementNo" : 34, 	"order" : 34, 	"name" : "sw.postcode", 	"label" : "Sw Postcode", 	"dataType" : "text" },
                    { 	"elementNo" : 35, 	"order" : 35, 	"name" : "sw.landline", 	"label" : "Sw Landline", 	"dataType" : "text" },
                    { 	"elementNo" : 36, 	"order" : 36, 	"name" : "sw.relationship", 	"label" : "Sw Relationship", 	"dataType" : "text" },
                    { 	"elementNo" : 37, 	"order" : 37, 	"name" : "sw.support", 	"label" : "Sw Support", 	"dataType" : "text" },
                    { 	"elementNo" : 38, 	"order" : 38, 	"name" : "other.1", 	"label" : "Other 1", 	"dataType" : "text" },
                    { 	"elementNo" : 39, 	"order" : 39, 	"name" : "other.2", 	"label" : "Other 2", 	"dataType" : "text" },
                    { 	"elementNo" : 40, 	"order" : 40, 	"name" : "other.3", 	"label" : "Other 3", 	"dataType" : "text" },
                    { 	"elementNo" : 41, 	"order" : 41, 	"name" : "background_info", 	"label" : "Background Info", 	"dataType" : "text" },
                    { 	"elementNo" : 42, 	"order" : 42, 	"name" : "give_access", 	"label" : "Give Access", 	"dataType" : "text" },
                    { 	"elementNo" : 43, 	"order" : 43, 	"name" : "access_instructions", 	"label" : "Access Instructions", 	"dataType" : "text" },
                    { 	"elementNo" : 44, 	"order" : 44, 	"name" : "key_consent", 	"label" : "Key Consent", 	"dataType" : "text" },
                    { 	"elementNo" : 45, 	"order" : 45, 	"name" : "key_safe", 	"label" : "Key Safe", 	"dataType" : "text" },
                    { 	"elementNo" : 46, 	"order" : 46, 	"name" : "key_holders", 	"label" : "Key Holders", 	"dataType" : "text" },
                    { 	"elementNo" : 47, 	"order" : 47, 	"name" : "outcomes", 	"label" : "Outcomes", 	"dataType" : "text" },
                    { 	"elementNo" : 48, 	"order" : 48, 	"name" : "goals_and_aspirations", 	"label" : "Goals And Aspirations", 	"dataType" : "text" },
                    { 	"elementNo" : 49, 	"order" : 49, 	"name" : "plan.1.description", 	"label" : "Plan 1 Description", 	"dataType" : "text" },
                    { 	"elementNo" : 50, 	"order" : 50, 	"name" : "plan.1.how", 	"label" : "Plan 1 How", 	"dataType" : "text" },
                    { 	"elementNo" : 51, 	"order" : 51, 	"name" : "plan.1.what", 	"label" : "Plan 1 What", 	"dataType" : "text" },
                    { 	"elementNo" : 52, 	"order" : 52, "name" : "plan.1.risk", 	"label" : "Plan 1 Risk", 	"dataType" : "text" },
                    { 	"elementNo" : 53, 	"order" : 53, 	"name" : "plan.1.goal", 	"label" : "Plan 1 Goal", 	"dataType" : "text" },
                    { 	"elementNo" : 54, 	"order" : 54, 	"name" : "plan.2.description", 	"label" : "Plan 2 Description", 	"dataType" : "text" },
                    { 	"elementNo" : 55, 	"order" : 55, 	"name" : "plan.2.how", 	"label" : "Plan 2 How", 	"dataType" : "text" },
                    { 	"elementNo" : 56, 	"order" : 56, "name" : "plan.2.what", 	"label" : "Plan 2 What", 	"dataType" : "text" },
                    { 	"elementNo" : 57, 	"order" : 57, 	"name" : "plan.2.risk", 	"label" : "Plan 2 Risk", 	"dataType" : "text" },
                    { 	"elementNo" : 58, 	"order" : 58, 	"name" : "plan.2.goal", 	"label" : "Plan 2 Goal", 	"dataType" : "text" },
                    { 	"elementNo" : 59, 	"order" : 59, 	"name" : "plan.3.description", 	"label" : "Plan 3 Description", 	"dataType" : "text" },
                    { 	"elementNo" : 60, 	"order" : 60, 	"name" : "plan.3.how", 	"label" : "Plan 3 How", 	"dataType" : "text" },
                    { 	"elementNo" : 61, 	"order" : 61, 	"name" : "plan.3.what", 	"label" : "Plan 3 What", 	"dataType" : "text" },
                    { 	"elementNo" : 62, 	"order" : 62, 	"name" : "plan.3.risk", 	"label" : "Plan 3 Risk", 	"dataType" : "text" },
                    { 	"elementNo" : 63, 	"order" : 63, 	"name" : "plan.3.goal", 	"label" : "Plan 3 Goal", 	"dataType" : "text" },
                    { 	"elementNo" : 64, 	"order" : 64, "name" : "plan.4.description", 	"label" : "Plan 4 Description", 	"dataType" : "text" },
                    { 	"elementNo" : 65, 	"order" : 65, 	"name" : "plan.4.how", 	"label" : "Plan 4 How", 	"dataType" : "text" },
                    { 	"elementNo" : 66, 	"order" : 66, 	"name" : "plan.4.what", 	"label" : "Plan 4 What", 	"dataType" : "text" },
                    { 	"elementNo" : 67, 	"order" : 67, 	"name" : "plan.4.risk", 	"label" : "Plan 4 Risk", 	"dataType" : "text" },
                    { 	"elementNo" : 68, 	"order" : 68, 	"name" : "plan.4.goal", 	"label" : "Plan 4 Goal", 	"dataType" : "text" },
                    { 	"elementNo" : 69, 	"order" : 69, 	"name" : "plan.5.description", 	"label" : "Plan 5 Description", 	"dataType" : "text" },
                    { 	"elementNo" : 70, 	"order" : 70, 	"name" : "plan.5.how", 	"label" : "Plan 5 How", 	"dataType" : "text" },
                    { 	"elementNo" : 71, 	"order" : 71, 	"name" : "plan.5.what", 	"label" : "Plan 5 What", 	"dataType" : "text" },
                    { 	"elementNo" : 72, 	"order" : 72, 	"name" : "plan.5.risk", 	"label" : "Plan 5 Risk", 	"dataType" : "text" },
                    { 	"elementNo" : 73, 	"order" : 73, 	"name" : "plan.5.goal", 	"label" : "Plan 5 Goal", 	"dataType" : "text" },
                    { 	"elementNo" : 74, 	"order" : 74, 	"name" : "plan.6.description", 	"label" : "Plan 6 Description", 	"dataType" : "text" },
                    { 	"elementNo" : 75, 	"order" : 75, 	"name" : "plan.6.how", 	"label" : "Plan 6 How", 	"dataType" : "text" },
                    { 	"elementNo" : 76, 	"order" : 76, 	"name" : "plan.6.what", 	"label" : "Plan 6 What", 	"dataType" : "text" },
                    { 	"elementNo" : 77, 	"order" : 77, "name" : "plan.6.risk", 	"label" : "Plan 6 Risk", 	"dataType" : "text" },
                    {   "elementNo" : 78, 	"order" : 78, 	"name" : "plan.6.goal", 	"label" : "Plan 6 Goal", 	"dataType" : "text" },
                    { 	"elementNo" : 79, 	"order" : 79, 	"name" : "plan.7.description", 	"label" : "Plan 7 Description", 	"dataType" : "text" },
                    { 	"elementNo" : 80, 	"order" : 80, 	"name" : "plan.7.how", 	"label" : "Plan 7 How", 	"dataType" : "text" },
                    { 	"elementNo" : 81, 	"order" : 81, "name" : "plan.7.what", 	"label" : "Plan 7 What", 	"dataType" : "text" },
                    { 	"elementNo" : 82, 	"order" : 82, 	"name" : "plan.7.risk", 	"label" : "Plan 7 Risk", 	"dataType" : "text" },
                    { 	"elementNo" : 83, 	"order" : 83, 	"name" : "plan.7.goal", 	"label" : "Plan 7 Goal", 	"dataType" : "text" },
                    { 	"elementNo" : 84, 	"order" : 84, 	"name" : "plan.8.description", 	"label" : "Plan 8 Description", 	"dataType" : "text" },
                    { 	"elementNo" : 85, 	"order" : 85, 	"name" : "plan.8.how", 	"label" : "Plan 8 How", 	"dataType" : "text" },
                    { 	"elementNo" : 86, 	"order" : 86, 	"name" : "plan.8.what", 	"label" : "Plan 8 What", 	"dataType" : "text" },
                    { 	"elementNo" : 87, 	"order" : 87, 	"name" : "plan.8.risk", 	"label" : "Plan 8 Risk", 	"dataType" : "text" },
                    { 	"elementNo" : 88, 	"order" : 88, 	"name" : "plan.8.goal", 	"label" : "Plan 8 Goal", 	"dataType" : "text" },
                    { 	"elementNo" : 89, 	"order" : 89, "name" : "other_things", 	"label" : "Other Things", 	"dataType" : "text" }
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
                expect(el.length).toBe(90);

//                for (var i = 0 ; i < 90; i++) {
//                    el = angular.element(elm.find('.hierarchy-list')[i]);
//                    dump(i);
//                    dump(scope.record.Hierarchy[i]);
////                    expect(el.text()).toBe('Score');
//                }
            });
        });
    });
});
