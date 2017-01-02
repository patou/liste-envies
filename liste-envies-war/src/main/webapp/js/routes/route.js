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
            resolve: { pageInfo: ['$http', '$location', '$q', function ($http, $location, $q) {
                var searchObject = $location.search();
                console.log('resolve :', searchObject);
                var req = {
                    method: 'GET',
                    url: 'https://mercury.postlight.com/parser?url='+searchObject.url,
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': '0LYlvHDUtTj7ZNzPOm8FGKBmLEhTuASqNj1zwdxI'
                    }
                };

                var deferred = $q.defer();

                $http(req).then(function(data){
                    deferred.resolve(data.data);
                }, function(error){
                    deferred.reject(error);
                });

                return deferred.promise;
            }]},
            controllerAs: "vm"
        }).when("/:name", {
            templateUrl: "templates/envies.html",
            name: 'Envie',
            controller: "EnvieCtrl",
            controllerAs: "vm"
        })
        .otherwise({ redirectTo: '/'});
});