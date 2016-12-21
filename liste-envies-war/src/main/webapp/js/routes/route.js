app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "templates/home.html",
            name: 'Home',
            controller: "HomeCtrl",
            controllerAs: "vm"
        })
        .when("/addWish/", {
            templateUrl: "templates/addWish.html",
            name: 'addWish',
            controller: "AddWishCtrl",
            controllerAs: "vm"
        }).when("/:name", {
            templateUrl: "templates/envies.html",
            name: 'Envie',
            controller: "EnvieCtrl",
            controllerAs: "vm"
        })
        .otherwise({ redirectTo: '/'});
});