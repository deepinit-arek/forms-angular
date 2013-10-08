describe('fng-hierarchy directives', function() {

	var elm, scope, $httpBackend, loadHierarchyList, loadForm, ngDragDropService, $timeout, recordData, formSchema, schemaHierarchy, hierarchy;

	beforeEach(function() {

		angular.mock.module('formsAngular');
		angular.mock.module('myDemoApp');
		angular.mock.module('app/template/hierarchy-master.html');
		module('ngDragDrop');
		recordData = {
			"Name": "test2",
			"_id": "524e73ae7d7f3c9047000005",
			"Hierarchy": [{
				"elementNo": 0,
				"name": "This is a new hierarchy",
				"dataType": "container"
			}, {
				"elementNo": 15,
				"parent": 0,
				"name": "lower",
				"dataType": "text"
			}, {
				"elementNo": 4,
				"name": "secon"
			}]
		};
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

		hierarchy = [{
			name: 'This is a new hierarchy',
			id: 'f_0',
			label: 'This Is A New Hierarchy',
			type: 'container',
			elementNo: 0,
			content: [
				[{
					name: 'lower',
					id: 'f_15',
					label: 'Lower',
					type: 'text',
					elementNo: 15,
					'$$hashKey': '09S'
				}]
			],
			'$$hashKey': '09G'
		}, {
			name: 'secon',
			id: 'f_4',
			label: 'Secon',
			type: 'text',
			elementNo: 4,
			'$$hashKey': '09H'
		}, {
			name: '',
			id: 'f_16',
			label: '',
			type: 'text',
			elementNo: 16,
			'$$hashKey': '09I'
		}]
	});



	describe('initialisation and basic usage', function() {

		beforeEach(function() {

			inject(function($rootScope, $controller, $compile, _$httpBackend_, $templateCache) {

				$httpBackend = _$httpBackend_;
				scope = $rootScope;

				scope.remove = function() {
					scope.record.Hierarchy.pop();
				}

				scope.record = recordData;

				scope.formSchema = formSchema;

				scope.__schema_Hierarchy = schemaHierarchy;

				$httpBackend.whenGET('/template/hierarchy-master.html').respond($templateCache.get('app/template/hierarchy-master.html'));
				var template = '<fng-hierarchy-list data-record="record.Hierarchy" data-schema="__schema_Hierarchy"></fng-hierarchy-list>';
				elm = angular.element(template);
				$compile(elm)(scope);
				scope.$digest();
				$httpBackend.flush();

			});
		});

		it('should load', function() {

			$httpBackend.expectGET('/template/hierarchy-master.html');

		});

		it('should load child hierarchy', function() {

			var el = elm.find('fng-hierarchy-child');
			expect(el.length).toBe(3);

		});

		it('should remove a hierarchy element', function() {

			var el = elm.find('i.icon-minus-sign');


			expect(el.length).toBe(3);
			$(el[2]).click();
			el = elm.find('i.icon-minus-sign');
			expect(el.length).toBe(2);

		});

		it('should not remove a hierarchy element if it has children', function() {

			var el = elm.find('i.icon-minus-sign');


			expect(el.length).toBe(3);
			$(el[0]).click();
			el = elm.find('i.icon-minus-sign');
			expect(el.length).toBe(3);

		});

		it('should add a new entry form when clicking add', function() {

			var el = elm.find('input');
			expect(el.length).toBe(0);
			var add = elm.find('.icon-plus-sign');
			$(add[1]).click();
			el = elm.find('input');
			expect(el.length).toBe(2);

		});

		it('should display a form when clicking edit', function() {

			var el = elm.find('input');
			expect(el.length).toBe(0);
			var edit = elm.find('.icon-edit');
			$(edit[0]).click();
			el = elm.find('input');
			expect(el.length).toBe(2);

		});


		it('should return the correct elementNo when adding a new element', function() {

			var el = elm.find('input');
			expect(el.length).toBe(0);
			var add = elm.find('.icon-plus-sign');
			//second element in declaration above has highest elementNo.
			var highestElementNo = 15;
			$(add[add.length - 1]).click();
			expect(scope.record.Hierarchy[scope.record.Hierarchy.length - 1].elementNo).toBe(highestElementNo + 1);
		});

		it('should emit showErrorMessage event if you try to delete a container with children', function() {


			spyOn(scope, "$emit");	

			var remove = elm.find('.icon-minus-sign');

			$(remove[0]).click();

			expect(scope.$emit).toHaveBeenCalledWith('showErrorMessage', {title: 'You can\'t do that', body: 'The element you are trying to delete has children. Please remove them first.'});
		});

	});

	xdescribe('drag drop functions', function() {

		beforeEach(function() {

			inject(function($rootScope, $controller, $compile, _$httpBackend_, $templateCache, _$timeout_, _ngDragDropService_) {

				ngDragDropService = _ngDragDropService_;

				$timeout = _$timeout_;

				$httpBackend = _$httpBackend_;
				scope = $rootScope;

				scope.remove = function() {
					scope.record.Hierarchy.pop();
				}

				scope.record = recordData;

				scope.formSchema = formSchema;

				scope.__schema_Hierarchy = schemaHierarchy;
				
				scope.hier = hierarchy;

				

				$httpBackend.whenGET('/template/hierarchy-master.html').respond($templateCache.get('app/template/hierarchy-master.html'));
				var template = '<fng-hierarchy-list data-record="record.Hierarchy" data-schema="__schema_Hierarchy"></fng-hierarchy-list>';
				elm = angular.element(template);
				$compile(elm)(scope);
				scope.$digest();
				$httpBackend.flush();

			});
		});



		// 

		iit('should change the parent when dragging and dropping', function() {

			// var els = elm.find('.hierarchy-list');
			// var kids = $(els[0]).find('fng-hierarchy-child');

			// dump(scope);

			spyOn(scope, 'add');

			// var dropel = 

			// dump((scope.$eval(angular.element(els[0]).find('.ui-droppable').attr('jqyoui-droppable')) || []).onDrop);

			// dump(scope.$eval(angular.element(els[1]).attr('jqyoui-droppable')));
			// dump(angular.element(els[0]));
			// dump(scope.$eval(angular.element(els[0]).find('.ui-droppable').attr('jqyoui-droppable')).onDrop);

			// dump(angular.element(els[0].find('.ui-droppable')).attr('jqyoui-droppable'));
// 
			// dump(angular.element(els[0]).find('ui-droppable').attr('jqyoui-draggable'));

			// ngDragDropService.invokeDrop(angular.element(els[2]),angular.element(els[0]),document.createEvent('Event'),{});

			// ngDragDropService.callEventCallback(scope, (scope.$eval(angular.element(els[0]).find('.ui-droppable').attr('jqyoui-droppable')) || []).onDrop, document.createEvent('Event'), {}); 
			// ngDragDropService.callEventCallback(scope, 'onDrop', document.createEvent('Event'), {}); 

			// ngDragDropService.invokeDrop(
			//    $('<div data-drag="true" ng-model="list1" jqyoui-draggable="{index: 0, placeholder:true}">' + scope.list1[0].title + '</div>').data('$scope', scope),
			//    $('<div data-drop="true" ng-model="list2" jqyoui-droppable="{index: 0}"></div>').data('$scope', scope),
			//    document.createEvent('Event'),
			//    {}
			//  );

		});

	});



});