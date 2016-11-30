app.controller('EnvieCtrl', EnvieCtrl);
EnvieCtrl.$inject = ['envieService', 'appUserService', '$routeParams'];
function EnvieCtrl(envieService, appUserService, $routeParams) {
    var vm = this;
    vm.email = $routeParams.email;
    vm.user = loadUser(vm.email);
    loadListeEnvies()
    vm.addEnvie = function (envie) {
        envieService.save({email:vm.email}, envie, function() {
            loadListeEnvies();
        });
    };
    vm.given = function(id) {
        envieService.give({email:vm.email, id:id}, {}, function() {
            loadListeEnvies();
        });
    };

    function loadUser(email) {
        return appUserService.get({email:email});
    }
    function loadListeEnvies() {
        vm.listeEnvies = envieService.query({email: $routeParams.email});
        vm.listeEnvies.$promise.then(function(list) {
            angular.forEach(list, function(item) {
                if (item.userTake) {
                    item.userTakeUser = loadUser(item.userTake);
                }
            });
        });
    }
}