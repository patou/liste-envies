describe('Directive: list-envie.pageDirective', function () {
    var ele, scope;

    beforeEach(module('ListeEnviesDirectives'));
    beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope.$new();

        //update to match directive your testing
        ele = angular.element('<div pageDirective></div>');

        $compile(ele)(scope);
        scope.$apply();
    }));

    /**
     * @description
     * Sample test case to check if HTML rendered by the directive is non empty
     * */
    it('should not render empty html', function () {
        scope.$apply(function () {
            /**
             * Set the scope properties here.
             * scope.desc = 'test hostname';
             * scope.status = 'valid';
             *
             */
        });
        expect(ele.html()).not.toBe('');
    });
});
