describe('fng-hierarchy', function() {

	var ctrl, elm, scope, $httpBackend, ngDragDropService, $timeout, recordData, formSchema, schemaHierarchy, hierarchy;

	beforeEach(function() {



		angular.mock.module('formsAngular');
		angular.mock.module('app/template/hierarchy-master.html');
		inject(function(_utils_) {
		// module('ngDragDrop');
		recordData = {
			"Name": "test2",
			"_id": "524e73ae7d7f3c9047000005",
			"Hierarchy": [{
				"elementNo": 0,
				"name": "This_is_a_new_hierarchy1",
				"dataType": "container",
				"order": 0,
				"displayStatus": true,
				"label": "This is a new hierarchy1"
			}, {
				"elementNo": 1,
				"name": "lowerf",
				"dataType": "text",
				"parent": 0,
				"order": 7
			}, {
				"elementNo": 2,
				"name": "secon",
				"order": 5
			}, {
				"elementNo": 5,
				"name": "sdsdf",
				"dataType": "text",
				"order": 8
			}, {
				"elementNo": 6,
				"name": "but",
				"dataType": "text",
				"parent": 0,
				"order": 6
			}, {
				"elementNo": 7,
				"name": "yot1dddd",
				"label": "ttt",
				"dataType": "container",
				"order": 1,
				"displayStatus": true
			}, {
				"elementNo": 9,
				"parent": 7,
				"name": "second1",
				"order": 14,
				"label": "ttt",
			}, {
				"elementNo": 15,
				"order": 3,
				"label": "just this thingdfdfdff",
				"dataType": "textarea",
				"name": "just_this_thingdfdfdff"
			}]
		}


		// recordData = {
		// 	"Name": "test2",
		// 	"_id": "524e73ae7d7f3c9047000005",
		// 	"Hierarchy": [{
		// 		"elementNo": 0,
		// 		"name": "This is a new hierarchy",
		// 		"dataType": "container",
		// 		"displayStatus": true,
		// 		"parent": null
		// 	}, {
		// 		"elementNo": 15,
		// 		"parent": 0,
		// 		"name": "lower",
		// 		"dataType": "text"
		// 	}, {
		// 		"elementNo": 4,
		// 		"name": "secon"
		// 	}]
		// };
		formSchema = [{
			"name": "Name",
			"id": "f_Name",
			"label": " Name",
			"type": "text",
			"required": true,
			"add": "autofocus "
		}, {
			"hierarchy": true,
			"name": "Hierarchy",
			"id": "f_Hierarchy",
			"label": " Hierarchy",
			"schema": [{
				"name": "Hierarchy.name",
				"id": "f_Hierarchy.name",
				"label": "Name",
				"type": "text",
				"required": true
			}, {
				"name": "Hierarchy.label",
				"id": "f_Hierarchy.label",
				"label": "Label",
				"type": "text"
			}, {
				"name": "Hierarchy.dataType",
				"id": "f_Hierarchy.dataType",
				"label": "Data Type",
				"type": "select",
				"options": "f_Hierarchy_dataTypeOptions"
			}]
		}];

		schemaHierarchy = [{
			"name": "Hierarchy.name",
			"id": "f_Hierarchy.name",
			"label": "Name",
			"type": "text",
			"required": true
		}, {
			"name": "Hierarchy.label",
			"id": "f_Hierarchy.label",
			"label": "Label",
			"type": "text"
		}, {
			"name": "Hierarchy.dataType",
			"id": "f_Hierarchy.dataType",
			"label": "Data Type",
			"type": "select",
			"options": "f_Hierarchy_dataTypeOptions"
		}];

		hierarchy = _utils_.createFormSchema(recordData.Hierarchy);

	// 	hierarchy = [{
	// 		name: 'This is a new hierarchy',
	// 		id: 'f_0',
	// 		label: 'This Is A New Hierarchy',
	// 		type: 'container',
	// 		elementNo: 0,
	// 		content: [
	// 			[{
	// 				name: 'lower',
	// 				id: 'f_15',
	// 				label: 'Lower',
	// 				type: 'text',
	// 				elementNo: 15,
	// 				'$$hashKey': '09S',
	// 				parentReference: [{
	// 					name: 'This is a new hierarchy',
	// 					id: 'f_0',
	// 					label: 'This Is A New Hierarchy',
	// 					type: 'container',
	// 					elementNo: 0,
	// 					content: [
	// 						[{
	// 							name: 'lower',
	// 							id: 'f_15',
	// 							label: 'Lower',
	// 							type: 'text',
	// 							elementNo: 15,
	// 							'$$hashKey': '09S'
	// 						}]
	// 					],
	// 					'$$hashKey': '09G'
	// 				}, {
	// 					name: 'secon',
	// 					id: 'f_4',
	// 					label: 'Secon',
	// 					type: 'text',
	// 					elementNo: 4,
	// 					'$$hashKey': '09H'
	// 				}, {
	// 					name: '',
	// 					id: 'f_16',
	// 					label: '',
	// 					type: 'text',
	// 					elementNo: 16,
	// 					'$$hashKey': '09I'
	// 				}]
	// 			}]
	// 		],
	// 		'$$hashKey': '09G'
	// 	}, {
	// 		name: 'secon',
	// 		id: 'f_4',
	// 		label: 'Secon',
	// 		type: 'text',
	// 		elementNo: 4,
	// 		'$$hashKey': '09H'
	// 	}, {
	// 		name: '',
	// 		id: 'f_16',
	// 		label: '',
	// 		type: 'text',
	// 		elementNo: 16,
	// 		'$$hashKey': '09I'
	// 	}]
	});

});

	describe('fngHierarchyList directive', function() {

		beforeEach(function() {
			inject(function($rootScope, $controller, $compile, _$httpBackend_, $templateCache) {

				$httpBackend = _$httpBackend_;

				scope = $rootScope;

				scope.record = recordData;

				scope.formSchema = formSchema;

				scope.__schema_Hierarchy = schemaHierarchy;

				scope.path = recordData.Hierarchy;

				$httpBackend.whenGET('/template/hierarchy-master.html').respond($templateCache.get('app/template/hierarchy-master.html'));

				var template = '<fng-hierarchy-list data-record="record.Hierarchy" data-schema="__schema_Hierarchy"></fng-hierarchy-list>';

				elm = $compile(template)(scope);

				$httpBackend.flush();

				scope.$digest();

			});
		});


		describe('loading', function() {

			it('should load template', function() {

				$httpBackend.expectGET('/template/hierarchy-master.html');

			});

			it('should load child hierarchy', function() {

				var el = elm.find('fng-hierarchy-child');
				expect(el.length).toBe(8);

			});

		});

	});

	describe('fngHierarchyListCtrl Controller', function() {

		var $compile, utils;

		beforeEach(function() {
			inject(function($rootScope, $controller, _$compile_, _$httpBackend_, $templateCache, _utils_) {

				$httpBackend = _$httpBackend_;

				scope = $rootScope;

				$compile = _$compile_;

				scope.record = recordData;

				scope.path = recordData.Hierarchy;

				scope.model = 'Hierarchy';

				utils = _utils_

				ctrl = $controller("fngHierarchyListCtrl", {
					$scope: scope
				});

			});
		});


		describe('initial state', function() {



			it('variables should be defined', function() {

				expect(scope.hoverLine).toEqual(false);

			});

			it('functions should be defined', function() {

				expect(scope.onDrop).toBeDefined();
				expect(scope.onOver).toBeDefined();
				expect(scope.parsePath).toBeDefined();
				expect(ctrl.watchPath).toBeDefined();
				expect(scope.add).toBeDefined();
				expect(scope.addChild).toBeDefined();
				expect(scope.getNextElementNo).toBeDefined();

			});
		});

		describe('onDrop behaviour', function() {

			var event, ui, childElementNo;

			beforeEach(function() {

				event = document.createEvent('Event');

				ui = {
					draggable: {
						scope: function() {
							return {
								field: {
									elementNo: 1
								}
							}
						}
					}
				};

				childElementNo = ui.draggable.scope().field.elementNo;

				spyOn(scope, 'parsePath').andCallThrough();
				spyOn(scope, 'onDrop').andCallThrough();
				spyOn(scope, 'onOver').andCallThrough();
				spyOn(utils, 'getIndex').andCallThrough();
				spyOn(scope, '$apply').andCallThrough();
			});

			it('onDrop should have been called', function() {
				scope.onDrop(event, ui);
				expect(scope.onDrop).toHaveBeenCalledWith(event, ui);
			});
			it('onDrop should call OnOver', function() {
				scope.onDrop(event, ui);
				expect(scope.onOver).toHaveBeenCalledWith(event, ui);
			});
			it('onDrop should call $apply', function() {
				scope.onDrop(event, ui);
				expect(scope.$apply).toHaveBeenCalled();
			});
			it('onDrop should call utils.getIndex', function() {
				scope.onDrop(event, ui);
				expect(utils.getIndex).toHaveBeenCalledWith(scope.record, scope.model, childElementNo);
			});
			it('onDrop should call parsePath', function() {
				scope.onDrop(event, ui);
				expect(scope.parsePath).toHaveBeenCalled();
			});
			it('parent should be undefined', function() {
				expect(scope.record.Hierarchy[1].parent).toEqual(0);
				scope.onDrop(event, ui);
				expect(scope.record.Hierarchy[1].parent).toEqual(null);
			});

		});


		describe('onOver behaviour', function() {

			var event, ui;

			beforeEach(function() {

				event = document.createEvent('Event');

				ui = {};

				spyOn(scope, 'onOver').andCallThrough();

				spyOn(scope, '$apply').andCallThrough();

			});

			it('onOver should have been called', function() {
				scope.onOver(event, ui);
				expect(scope.onOver).toHaveBeenCalledWith(event, ui);
			});
			it('onOver should call $apply', function() {
				scope.onOver(event, ui);
				expect(scope.$apply).toHaveBeenCalled();
			});
			it('onOver should toggle scope.hoverLine', function() {

				var hoverLine = scope.hoverLine;
				expect(hoverLine).toEqual(scope.hoverLine);
				scope.onOver(event, ui);
				expect(hoverLine).not.toEqual(scope.hoverLine);

			});
		});

		describe('parsePath behaviour', function() {

			beforeEach(function() {
				spyOn(scope, 'parsePath').andCallThrough();
				spyOn(utils, 'createFormSchema').andCallThrough();
			});

			it('parsePath should have been called', function() {
				scope.parsePath();
				expect(scope.parsePath).toHaveBeenCalled();
			});
			it('onOver should call $apply', function() {
				scope.parsePath();
				expect(utils.createFormSchema).toHaveBeenCalled();
			});

		});

		describe('watchPath behaviour', function() {

			beforeEach(function() {
				spyOn(ctrl, 'watchPath').andCallThrough();
				spyOn(scope, 'parsePath').andCallThrough();
				spyOn(scope, '$watch').andCallThrough();
			});

			it('watchPath should have been called', function() {
				ctrl.watchPath();
				expect(ctrl.watchPath).toHaveBeenCalled();
			});

			it('$watch should have been called', function() {
				ctrl.watchPath();
				expect(scope.$watch).toHaveBeenCalled();

			});

			it('watchPath should call parsePath', function() {
				ctrl.watchPath();
				scope.$digest();
				scope.path.pop();
				scope.$digest();
				expect(scope.parsePath).toHaveBeenCalled();
			});

		});

		describe('addChild behaviour', function() {

			beforeEach(function () {
				spyOn(scope, 'addChild').andCallThrough();

				scope.add = function () {
					return scope.record.Hierarchy;
				
				}

				scope.getNextElementNo = function () {
					return 25; //arbitrary number
				
				}
			});

			it('scope.addChild should be called', function() {

				scope.addChild();
				expect(scope.addChild).toHaveBeenCalled();

			});

			it('scope.addChild should add a record', function() {

				var recordCount = scope.record.Hierarchy.length;

				scope.addChild();
				expect(recordCount).not.toEqual(scope.record.Hierarchy.length);

			});

		});

		describe('add behaviour', function() {

			var addReturnValue;

			beforeEach(function() {

				spyOn(scope, 'add').andCallThrough();

				addReturnValue = scope.add();



			});

			it('add should have been called', function() {


				expect(scope.add).toHaveBeenCalled();

			});

			it('add should return the hierarchy array', function() {

				expect(addReturnValue).toEqual(scope.record[scope.model]);

			});

		});

		describe('getNextElementNo behaviour', function() {

			var getNextElementNoReturnValue;

			beforeEach(function() {
				spyOn(scope, 'getNextElementNo').andCallThrough();

				getNextElementNoReturnValue = scope.getNextElementNo(scope.record[scope.model]);
			});

			it('getNextElementNo should have been called', function() {

				expect(scope.getNextElementNo).toHaveBeenCalledWith(scope.record[scope.model]);
			});

			it('getNextElementNo should return the highest elementNo in the array', function() {

				expect(getNextElementNoReturnValue).toEqual(16);

			});
		});
	});


	describe('fngHierarchyChild directive', function() {

		beforeEach(function() {
			inject(function($rootScope, $compile, $controller) {

				// $httpBackend = _$httpBackend_;

				scope = $rootScope;

				scope.record = recordData;



				// scope.formSchema = formSchema;

				// scope.__schema_Hierarchy = schemaHierarchy;

				// scope.path = recordData.Hierarchy;

				// // scope.hierarchy = hierarchy;

				scope.field = hierarchy[0];

				scope.model = 'Hierarchy';

				scope.hierarchy = hierarchy;

				scope.removeLine = function() {
					scope.record.Hierarchy.pop();
				};

				// scope.removeLine = function (model, elementNo) {

				// };

				// utilsService = utils;

				// $httpBackend.whenGET('/template/hierarchy-master.html').respond($templateCache.get('app/template/hierarchy-master.html'));
				elm = angular.element('<span ng-switch on="true"><span ng-switch-when="true"><fng-hierarchy-child ng-repeat="field in hierarchy"></fng-hierarchy-child></span></span>');
				$compile(elm)(scope);
				scope.$digest();

				// ctrl = $controller("fngHierarchyChildCtrl", {
				// 	$scope: scope
				// });
			});
		});


		describe('initial state', function() {

			it('should load child hierarchy', function() {

				var el = elm.find('.hierarchy-list');
				expect(el.length).toBe(8);

			});

		});


		//DONT WORK-----------------------------------------------------------------
		xdescribe('actions', function() {

			//TODO - won't work because function references function in baseCtrl.

			xit('should call removeLine when minus is clicked', function() {

				// spyOn(scope, 'removeLine').andReturn();

				var el = elm.find('i.icon-minus-sign');
				dump(el.length);

				$(el[0]).click();
				scope.$digest();

				dump(el.length);

				expect(el.length).toBe(3);
				expect(el.length).toBe(2);



				// expect(scope.removeLine).toHaveBeenCalled();


			});

			iit('should add a new entry form when clicking add', function() {

				var el = elm.find('input');
				expect(el.length).toBe(0);
				var add = elm.find('.icon-plus-sign');
				$(add[1]).click();
				el = elm.find('input');
				expect(el.length).toBe(2);

			});

			xit('should return the correct elementNo when adding a new element', function() {

				var el = elm.find('input');
				expect(el.length).toBe(0);
				var add = elm.find('.icon-plus-sign');
				//second element in declaration above has highest elementNo.
				var highestElementNo = 15;
				$(add[add.length - 1]).click();
				expect(scope.record.Hierarchy[scope.record.Hierarchy.length - 1].elementNo).toBe(highestElementNo + 1);
			});

			it('should not remove a hierarchy element if it has children', function() {

				var el = elm.find('i.icon-minus-sign');


				expect(el.length).toBe(3);
				$(el[0]).click();
				el = elm.find('i.icon-minus-sign');
				expect(el.length).toBe(3);

			});

			it('should display a form when clicking edit', function() {

				var el = elm.find('input');
				expect(el.length).toBe(0);
				var edit = elm.find('.icon-edit');
				$(edit[0]).click();
				el = elm.find('input');
				expect(el.length).toBe(2);

			});


			it('should emit showErrorMessage event if you try to delete a container with children', function() {


				spyOn(scope, "$emit");

				var remove = elm.find('.icon-minus-sign');

				$(remove[0]).click();

				expect(scope.$emit).toHaveBeenCalledWith('showErrorMessage', {
					title: 'You can\'t do that',
					body: 'The element you are trying to delete has children. Please remove them first.'
				});
			});
		});
		//DONT WORK-----------------------------------------------------------------
	});

	describe('fngHierarchyChildCtrl Controller', function() {

		//directive depends on utils service -  mock?

		beforeEach(function() {
			inject(function($rootScope, $controller) {

				// $httpBackend = _$httpBackend_;

				scope = $rootScope;

				scope.record = recordData;

				scope.field = hierarchy[0].content[0];

				scope.model = 'Hierarchy';
				scope.hierarchy = hierarchy;

				ctrl = $controller("fngHierarchyChildCtrl", {
					$scope: scope
				});
			});
		});


		describe('initial state', function() {

			it('variables should be defined', function() {

				expect(scope.hoverLine).toEqual(false);
				expect(scope.index).toBeDefined();
				expect(scope.toggleEditableElement).toBeDefined();

			});

			it('functions should be defined', function() {

				expect(scope.toggleChildren).toBeDefined();
				expect(scope.onDrop).toBeDefined();
				expect(scope.onOver).toBeDefined();
				expect(scope.onOut).toBeDefined();
				expect(scope.updateElement).toBeDefined();
				expect(scope.editElement).toBeDefined();
				expect(scope.removeLine).toBeDefined();
				expect(scope.addChild).toBeDefined();


			});
		});

		//not sure how to test this as it is not exposed on the object.
		//solution is to remove method and use ng-class in the template
		//however this is remarkably hard to work out. so leaving for now.
		//When done, this test is redundant.
		//TODO use ng-class for toggleFolderIcon()
		xdescribe('toggleFolderIcon behaviour', function() {

			// dump(formsAngular.controller('fngHierarchyChildCtrl'));

			spyOn(scope.prototype, 'toggleFolderIcon').andCallThrough();

			it('variables should be defined', function() {



			});

		});

		describe('toggleChildren behaviour', function() {

			beforeEach(function() {
				spyOn(scope, 'toggleChildren').andCallThrough();
			});

			it('toggleChildren should have been called', function() {
				scope.toggleChildren();
				expect(scope.toggleChildren).toHaveBeenCalled();
			});
			it('toggleChildren should toggle $scope.toggleChildElement', function() {
				var toggleChildElement = scope.toggleChildElement;
				expect(toggleChildElement).toEqual(scope.toggleChildElement);
				scope.toggleChildren();
				expect(toggleChildElement).not.toEqual(scope.toggleChildElement);
			});

		});

		xdescribe('onDrop behaviour', function() {

			var event, ui, childElementNo;

			beforeEach(function() {

				//mock angular.element

				// dump(angular.element);

				var ngElementFake = function(el) {
					return {
						scope: function() {
							return {
								toggleChildElement: true,
								field: scope.field
							}
						}
					}
				}

				event = document.createEvent('Event');

				ui = {
					draggable: {
						scope: function() {
							return {
								field: {
									elementNo: 0
								}
							}
						}
					}
				};

				// childElementNo = ui.draggable.scope().field.elementNo;

				scope.parsePath = function () {

				}

				spyOn(angular, 'element').andCallFake(ngElementFake);
				// spyOn(scope, 'onDrop').andCallThrough();
				// spyOn(scope, 'onOver').andCallThrough();
				// spyOn(utils, 'getIndex').andCallThrough();
				// spyOn(scope, '$apply').andCallThrough();
			});

			iit('onDrop should have been called', function() {
				// scope.$digest();
				scope.onDrop(event, ui);
				// expect(scope.onDrop).toHaveBeenCalledWith(event, ui);
			});
			it('onDrop should call OnOver', function() {
				scope.onDrop(event, ui);
				expect(scope.onOver).toHaveBeenCalledWith(event, ui);
			});
			it('onDrop should call $apply', function() {
				scope.onDrop(event, ui);
				expect(scope.$apply).toHaveBeenCalled();
			});
			it('onDrop should call utils.getIndex', function() {
				scope.onDrop(event, ui);
				expect(utils.getIndex).toHaveBeenCalledWith(scope.record, scope.model, childElementNo);
			});
			it('onDrop should call parsePath', function() {
				scope.onDrop(event, ui);
				expect(scope.parsePath).toHaveBeenCalled();
			});
			it('parent should be undefined', function() {
				expect(scope.record.Hierarchy[1].parent).toEqual(0);
				scope.onDrop(event, ui);
				expect(scope.record.Hierarchy[1].parent).toEqual(null);
			});

		});

		describe('updateElement behaviour', function() {

			beforeEach(function () {
				spyOn(scope, 'updateElement').andCallThrough();
				spyOn(scope, '$emit').andCallThrough();
			});

			it('scope.updateElement should be called', function() {

				scope.updateElement();
				expect(scope.updateElement).toHaveBeenCalled();

			});

			it('updateElement should error and $emit error', function() {

				scope.field = hierarchy[0].content[0];
				scope.updateElement();
				expect(scope.$emit).toHaveBeenCalled();

			});

			it('updateElement should not $emit error', function() {

				scope.field = hierarchy[0];
				scope.updateElement();
				expect(scope.$emit).not.toHaveBeenCalled();

			});

			it('updateElement should toggleEditableElement', function() {

				var toggleEditableElement = scope.toggleEditableElement;

				scope.field = hierarchy[0];
				scope.updateElement();
				expect(toggleEditableElement).not.toEqual(scope.toggleEditableElement);

			});

			it('updateElement should throw error if updating non-empty container to something else', function() {

				scope.field = hierarchy[0];
				scope.record.Hierarchy[0].dataType = 'text';
				scope.updateElement();
				expect(scope.$emit).toHaveBeenCalled();

			});

			it('updateElement should change dataType back to container if updating non-empty container to something else', function() {

				scope.field = hierarchy[0];
				scope.record.Hierarchy[0].dataType = 'text';
				scope.updateElement();
				expect(scope.record.Hierarchy[0].dataType).toEqual('container');

			});

		});

		describe('editElement behaviour', function() {

			beforeEach(function () {
				spyOn(scope, 'editElement').andCallThrough();
			});

			it('scope.editElement should be called', function() {

				scope.editElement();
				expect(scope.editElement).toHaveBeenCalled();

			});
			it('editElement should toggleEditableElement', function() {

				var toggleEditableElement = scope.toggleEditableElement;

				scope.field = hierarchy[0];
				scope.editElement();
				expect(toggleEditableElement).not.toEqual(scope.toggleEditableElement);

			});
		});

		describe('removeLine behaviour', function() {

			beforeEach(function () {

				scope.remove = function () {
						scope.record.Hierarchy.pop();
				}

				spyOn(scope, 'removeLine').andCallThrough();
				spyOn(scope, '$emit').andCallThrough();
				spyOn(scope, 'remove').andCallThrough();
			});

			it('scope.removeLine should be called', function() {

				scope.removeLine(scope.model, scope.field.elementNo);
				expect(scope.removeLine).toHaveBeenCalledWith(scope.model, scope.field.elementNo);

			});

			it('removeLine should error and $emit error if content scope.field.content is not empty', function() {

				scope.field = hierarchy[0];
				scope.removeLine(scope.model, scope.field.elementNo);
				expect(scope.$emit).toHaveBeenCalled();

			});

			it('removeLine should call scope.remove', function() {

				// scope.field = hierarchy[0];
				scope.removeLine(scope.model, scope.field.elementNo);
				expect(scope.remove).toHaveBeenCalled();

			});

			it('removeLine should NOT call scope.remove', function() {

				scope.field = hierarchy[0];
				scope.removeLine(scope.model, scope.field.elementNo);
				expect(scope.remove).not.toHaveBeenCalled();

			});

		});

		describe('addChild behaviour', function() {

			beforeEach(function () {
				spyOn(scope, 'addChild').andCallThrough();

				scope.add = function () {
					return scope.record.Hierarchy;
				
				}

				scope.getNextElementNo = function () {
					return 25;
				
				}
			});

			it('scope.addChild should be called', function() {

				scope.addChild(null, 0);
				expect(scope.addChild).toHaveBeenCalledWith(null, 0);

			});

			it('scope.addChild should add a record', function() {

				var recordCount = scope.record.Hierarchy.length;

				scope.addChild(null, 0);
				expect(recordCount).not.toEqual(scope.record.Hierarchy.length);

			});

		});



	});

	xdescribe('drag drop functions', function() {

		beforeEach(function() {

			inject(function($rootScope, $controller, $compile, _$httpBackend_, $templateCache, _$timeout_, _ngDragDropService_) {

				// dump($attrs);

				ngDragDropService = _ngDragDropService_;


				$timeout = _$timeout_;

				$httpBackend = _$httpBackend_;
				scope = $rootScope;

				scope.remove = function() {
					scope.record.Hierarchy.pop();
				}

				// scope.onDrop = function() {
				// 	return true;
				// }

				scope.record = recordData;

				scope.formSchema = formSchema;

				scope.__schema_Hierarchy = schemaHierarchy;

				// scope.hier = hierarchy;



				$httpBackend.whenGET('/template/hierarchy-master.html').respond($templateCache.get('app/template/hierarchy-master.html'));
				var template = '<fng-hierarchy-list data-record="record.Hierarchy" data-schema="__schema_Hierarchy"></fng-hierarchy-list>';
				elm = angular.element(template);
				$compile(elm)(scope);
				scope.$digest();
				$httpBackend.flush();

				ctrl = $controller("fngHierarchyListCtrl", {
					$scope: scope,
					$element: elm,
					$attrs: {},
					$transclude: {}
				});

			});
		});

		it('should change the parent when dragging and dropping', function() {

			// var els = elm.find('.hierarchy-list');
			// var kids = $(els[0]).find('fng-hierarchy-child');

			// spyOn(scope, 'onDrop').andCallThrough();

			// ngDragDropService.callEventCallback(scope, (scope.$eval(angular.element(els[0]).find('.ui-droppable').attr('jqyoui-droppable')) || []).onDrop, document.createEvent('Event'), {}); 

			// ngDragDropService.callEventCallback(scope, 'onDrop', document.createEvent('Event'), {}); 
			// expect(scope.onDrop).toHaveBeenCalled();
			// 

		});

	});



});