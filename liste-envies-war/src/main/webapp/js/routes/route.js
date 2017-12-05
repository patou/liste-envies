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

                    const email = (user)? user.email : 'email';
                    return appUserService.archived({email: email}).$promise;
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

                const email = (user)? user.email : 'email';
                return appUserService.given({email: email}).$promise;
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