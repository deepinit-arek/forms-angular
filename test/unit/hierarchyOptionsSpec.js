describe('"Hierarchy options"', function () {

    var $httpBackend;

    beforeEach(function () {
        angular.mock.module('formsAngular');
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('sets up fieldnames', function () {

        it('for the default case', function () {
            inject(function (_$httpBackend_, $rootScope, $controller, $location) {
                $httpBackend = _$httpBackend_;
                $httpBackend.whenGET('api/schema/collection').respond({"name":{"enumValues":[],"regExp":null,"path":"name","instance":"String","validators":[[null,"Path `{PATH}` is required.","required"]],"setters":[],"getters":[],"options":{"required":true,"index":true,"list":{}},"_index":true,"isRequired":true,"$conditionalHandlers":{}},"parts":{"schema":{"displayName":{"enumValues":[],"regExp":null,"path":"displayName","instance":"String","validators":[[null,"Path `{PATH}` is required.","required"]],"setters":[],"getters":[],"options":{"required":true,"list":{}},"_index":null,"isRequired":true,"$conditionalHandlers":{}},"part":{"enumValues":[],"regExp":null,"path":"part","instance":"String","validators":[],"setters":[],"getters":[],"options":{"form":{"showIf":{"lhs":"$Hierarchy.fngh_isContainer","comp":"eq","rhs":"false"}}},"_index":null,"$conditionalHandlers":{}},"partNumber":{"path":"partNumber","instance":"Number","validators":[],"setters":[],"getters":[],"options":{"form":{"showIf":{"lhs":"$Hierarchy.fngh_isContainer","comp":"eq","rhs":"false"}}},"_index":null,"$conditionalHandlers":{}},"howMany":{"path":"howMany","instance":"Number","validators":[],"setters":[],"getters":[],"options":{"form":{"showIf":{"lhs":"$Hierarchy.fngh_isContainer","comp":"eq","rhs":"false"}}},"_index":null,"$conditionalHandlers":{}},"fngh_elementNo":{"path":"fngh_elementNo","instance":"Number","validators":[[null,"Path `{PATH}` is required.","required"]],"setters":[],"getters":[],"options":{"required":true,"form":{"hidden":true}},"_index":null,"isRequired":true,"$conditionalHandlers":{}},"fngh_parent":{"path":"fngh_parent","instance":"Number","validators":[],"setters":[],"getters":[],"options":{"form":{"hidden":true}},"_index":null,"$conditionalHandlers":{}},"fngh_displayStatus":{"path":"fngh_displayStatus","instance":"boolean","validators":[],"setters":[],"getters":[],"options":{"form":{"hidden":true}},"_index":null},"fngh_order":{"path":"fngh_order","instance":"Number","validators":[],"setters":[],"getters":[],"options":{"form":{"hidden":true}},"_index":null,"$conditionalHandlers":{}},"fngh_isContainer":{"path":"fngh_isContainer","instance":"boolean","validators":[],"setters":[],"getters":[],"options":{},"_index":null}},"options":{"form":{"hierarchy":true}}},"_id":{"path":"_id","instance":"ObjectID","validators":[],"setters":[null],"getters":[],"options":{"auto":true},"_index":null,"$conditionalHandlers":{}}});
                $location.$$path = '/collection/new';
                scope = $rootScope.$new();
                ctrl = $controller("BaseCtrl", {$scope: scope});
                $httpBackend.flush();
            });
            expect(scope.hierarchyOptions.elementNoFld).toBe('fngh_elementNo');
            expect(scope.hierarchyOptions.parentFld).toBe('fngh_parent');
            expect(scope.hierarchyOptions.displayStatusFld).toBe('fngh_displayStatus');
            expect(scope.hierarchyOptions.orderFld).toBe('fngh_order');
            expect(scope.hierarchyOptions.isContainerFld).toBe('fngh_isContainer');
        });

        it('for overrides', function () {
            inject(function (_$httpBackend_, $rootScope, $controller, $location) {
                $httpBackend = _$httpBackend_;
                $httpBackend.whenGET('api/schema/collection').respond({"name":{"enumValues":[],"regExp":null,"path":"name","instance":"String","validators":[[null,"Path `{PATH}` is required.","required"]],"setters":[],"getters":[],"options":{"required":true,"index":true,"list":{}},"_index":true,"isRequired":true,"$conditionalHandlers":{}},"parts":{"schema":{"displayName":{"enumValues":[],"regExp":null,"path":"displayName","instance":"String","validators":[[null,"Path `{PATH}` is required.","required"]],"setters":[],"getters":[],"options":{"required":true,"list":{}},"_index":null,"isRequired":true,"$conditionalHandlers":{}},"part":{"enumValues":[],"regExp":null,"path":"part","instance":"String","validators":[],"setters":[],"getters":[],"options":{"form":{"showIf":{"lhs":"$parts.fngh_isContainer","comp":"eq","rhs":"false"}}},"_index":null,"$conditionalHandlers":{}},"partNumber":{"path":"partNumber","instance":"Number","validators":[],"setters":[],"getters":[],"options":{"form":{"showIf":{"lhs":"$parts.fngh_isContainer","comp":"eq","rhs":"false"}}},"_index":null,"$conditionalHandlers":{}},"howMany":{"path":"howMany","instance":"Number","validators":[],"setters":[],"getters":[],"options":{"form":{"showIf":{"lhs":"$parts.fngh_isContainer","comp":"eq","rhs":"false"}}},"_index":null,"$conditionalHandlers":{}},"fngh_elementNo":{"path":"fngh_elementNo","instance":"Number","validators":[[null,"Path `{PATH}` is required.","required"]],"setters":[],"getters":[],"options":{"required":true,"form":{"hidden":true}},"_index":null,"isRequired":true,"$conditionalHandlers":{}},"fngh_parent":{"path":"fngh_parent","instance":"Number","validators":[],"setters":[],"getters":[],"options":{"form":{"hidden":true}},"_index":null,"$conditionalHandlers":{}},"fngh_displayStatus":{"path":"fngh_displayStatus","instance":"boolean","validators":[],"setters":[],"getters":[],"options":{"form":{"hidden":true}},"_index":null},"fngh_order":{"path":"fngh_order","instance":"Number","validators":[],"setters":[],"getters":[],"options":{"form":{"hidden":true}},"_index":null,"$conditionalHandlers":{}},"fngh_isContainer":{"path":"fngh_isContainer","instance":"boolean","validators":[],"setters":[],"getters":[],"options":{},"_index":null}},"options":{"form":{"hierarchy":{"elementNoFld":"elementNo","parentFld":"parent","displayStatusFld":"displayStatus","orderFld":"order","isContainerFld":"isContainer"}}}},"_id":{"path":"_id","instance":"ObjectID","validators":[],"setters":[null],"getters":[],"options":{"auto":true},"_index":null,"$conditionalHandlers":{}}});
                $location.$$path = '/collection/new';
                scope = $rootScope.$new();
                ctrl = $controller("BaseCtrl", {$scope: scope});
                $httpBackend.flush();
            });
            expect(scope.hierarchyOptions.elementNoFld).toBe('elementNo');
            expect(scope.hierarchyOptions.parentFld).toBe('parent');
            expect(scope.hierarchyOptions.displayStatusFld).toBe('displayStatus');
            expect(scope.hierarchyOptions.orderFld).toBe('order');
            expect(scope.hierarchyOptions.isContainerFld).toBe('isContainer');
        });

    });

});

