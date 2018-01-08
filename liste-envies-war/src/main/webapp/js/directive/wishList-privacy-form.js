angular.module('ListeEnviesDirectives')
    .directive('privacyForm', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/directive/wishList-privacy-form.html',
            bindToController: true,
            controllerAs: 'w',
            controller: privacyForm,
            scope: {
                "privacy": "@"
            }
        };
    });

privacyForm.$inject = [];
function privacyForm() {
    var vm = this;
}