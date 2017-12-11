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
            scope: "="
        }
    });
PagesDirectivesController.$inject = ['$scope', '$http', '$location', 'AuthService', 'UtilitiesServices', 'appUserService'];
function PagesDirectivesController ($scope, $http, $location, AuthService, UtilitiesServices, appUserService) {

    var main = this;
    if (this.scope) {
        this.scope.main = this;
    }
    main.isActive = function(viewLocation) {
        return viewLocation === $location.path();
    };

    main.wishLists = null;


    main.Notifications = [];


    main.host = window.location.host;

    AuthService.refresh().then(function (user) {
        main.isAuthenticated = AuthService.isAuthenticated();
        main.isAdmin = AuthService.isAdmin();
        main.user = user;

        if (main.isAuthenticated) {

            if (main.user.newUser) {
                $location.url("/profil");
            }
            UtilitiesServices.getList().then(function (data) {
                main.wishLists = data;
            });

            appUserService.notification({email: main.user.email}).$promise.then(function (data) {
                main.Notifications = eval(data);
            });
        } else {
            main.wishLists = null;
        }

    });

    main.goList = function (name) {
        $location.url("/"+name);
    };

    main.loginPath = function() {
        return "/login?path=" + encodeURIComponent($location.path());
    };
    main.logoutPath = function() {
        return "/logout?path=" + encodeURIComponent($location.path());
    };

    main.notifClass = function(type) {
        switch (type) {
            //ADD_WISH, UPDATE_WISH, DELETE_WISH, GIVEN_WISH, NEW_LIST, ADD_USER, ARCHIVE_WISH, ADD_NOTE
            case 'ADD_WISH':
                return 'fa-plus';
            case 'UPDATE_WISH':
                return 'fa-pencil';
            case 'DELETE_WISH':
                return 'fa-trash';
            case 'GIVEN_WISH':
                return 'fa-gift';
            case 'NEW_LIST':
                return 'fa-list';
            case 'ADD_USER':
                return 'fa-share-square-o';
            case 'ARCHIVE_WISH':
                return 'fa-archive';
            case 'ADD_NOTE':
                return 'fa-comment';
            default:
                return 'fa-bell';
        }
    };

    loadMaterialsKits();


}