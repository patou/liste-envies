app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "templates/home.html",
            name: 'Home',
            controller: "HomeCtrl",
            controllerAs: "vm"
        })
        .when("/addWish", {
            templateUrl: "templates/addWish.html",
            name: 'addWish',
            controller: "AddWishCtrl",
            resolve: {
                pageInfo: ['$http', '$location', '$q', 'UtilitiesServices', function ($http, $location, $q, UtilitiesServices) {
                    var searchObject = $location.search();
                    console.log('resolve :', searchObject);
                    if (searchObject.url) {
                        return UtilitiesServices.findInfoFromurl(searchObject.url);
                    }
                    return $q.resolve(null);

                }]
            },
            controllerAs: "vm"
        }).when("/archive", {
        templateUrl: "templates/wishesList.html",
        name: 'archive',
        controller: "WichesCtrl",
        resolve: {
            wishes: ['appUserService', 'AuthService', function (appUserService, AuthService) {

                const user = AuthService.getUser();
                if (user) {
                    return appUserService.archived({email: user.email}).$promise;
                }
                return [];
            }], type: [function () {
                return 'ARCHIVE';
            }]
        },
        controllerAs: "vm"
    }).when("/given", {
        templateUrl: "templates/wishesList.html",
        name: 'given',
        controller: "WichesCtrl",
        resolve: {
            wishes: ['appUserService', 'AuthService', function (appUserService, AuthService) {

                const user = AuthService.getUser();
                if (user) {
                    return appUserService.given({email: user.email}).$promise;
                }
                return [];

            }], type: [function () {
                return 'GIVEN';
            }]
        },
        controllerAs: "vm"
    }).when("/:name", {
        templateUrl: "templates/wishList.html",
        name: 'Envie',
        controller: "EnvieCtrl",
        controllerAs: "vm"
    })
        .otherwise({redirectTo: '/'});
});