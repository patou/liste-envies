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
    AuthService.refresh();
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

    main.user = AuthService.getUser();
    $scope.$watch(function () { return AuthService.getUser(); }, function () {
        main.isAuthenticated = AuthService.isAuthenticated();
        main.isAdmin = AuthService.isAdmin();
        main.user = AuthService.getUser();

        if (main.isAuthenticated) {
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
        return "/login?path=" + $location.path();
    };
    main.logoutPath = function() {
        return "/logout?path=" + $location.path();
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
                return 'fa-user-plus';
            case 'ARCHIVE_WISH':
                return 'fa-archive';
            case 'ADD_NOTE':
                return 'fa-commenting';
            default:
                return 'fa-bell';
        }
    };

    loadMaterialsKits();


}