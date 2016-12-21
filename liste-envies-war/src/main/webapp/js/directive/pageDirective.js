/**
 * @ngdoc directive
 * @name list-envie:pageDirective
 *
 * @description
 *
 *
 * */
angular.module('ListeEnviesDirectives')
    .component('page', {
        templateUrl: 'templates/directive/pageDirective.html',
        controller: PagesDirectivesController,
        controllerAs: 'main',
        transclude: true,
        bindings: {

        }
    });
PagesDirectivesController.$inject = ['$scope', '$http', '$location', 'AuthService', 'UtilitiesServices'];
function PagesDirectivesController ($scope, $http, $location, AuthService, UtilitiesServices) {
    AuthService.refresh();
    var main = this;
    main.isActive = function(viewLocation) {
        return viewLocation === $location.path();
    };

    main.wishLists = null;

    main.user = AuthService.getUser();
    $scope.$watch(function () { return AuthService.getUser(); }, function () {
        main.isAuthenticated = AuthService.isAuthenticated();
        main.isAdmin = AuthService.isAdmin();
        main.user = AuthService.getUser();

        if (main.isAuthenticated) {
            UtilitiesServices.getList().then(function (data) {
                main.wishLists = data;
            });
        } else {
            main.wishLists = null;
        }

    });

    main.goList = function (name) {
        $location.url("/"+name);
    };

    main.loginPath = function() {
        return "/login?path=" + $location.path();
    };
    main.logoutPath = function() {
        return "/logout?path=" + $location.path();
    };

    loadMaterialsKits();


}