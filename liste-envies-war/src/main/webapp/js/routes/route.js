app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "templates/home.html",
            controller: "HomeCtrl",
            controllerAs: "vm",
        })
        .otherwise({ redirectTo: '/'});
});