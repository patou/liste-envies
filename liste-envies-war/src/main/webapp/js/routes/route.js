app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "templates/home.html",
            name: 'Home',
            controller: "HomeCtrl",
            controllerAs: "vm"
        })
        .when("/:email", {
            templateUrl: "templates/envies.html",
            name: 'Envie',
            controller: "EnvieCtrl",
            controllerAs: "vm"
        })
        .otherwise({ redirectTo: '/'});
});