describe('fng-hierarchy directives', function() {
	var elm, scope, $httpBackend, loadHierarchyList, loadForm;

	// load the form code
	beforeEach(function() {
		angular.mock.module('formsAngular');
		angular.mock.module('myDemoApp');
		angular.mock.module('app/template/hierarchy-master.html');

		inject(function($rootScope, $controller, $compile, _$httpBackend_, $templateCache) {

			$httpBackend = _$httpBackend_;
			scope = $rootScope;

			scope.remove = function() {
				scope.record.Hierarchy.pop();
			}

				scope.record = {
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

				scope.formSchema = [{
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

				scope.__schema_Hierarchy = [{
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
				}];;

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

	it('should display an form when clicking edit', function() {

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
		$(add[add.length-1]).click();
		expect(scope.record.Hierarchy[scope.record.Hierarchy.length-1].elementNo).toBe(highestElementNo+1);
	});


});