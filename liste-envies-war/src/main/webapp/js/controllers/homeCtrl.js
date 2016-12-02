app.controller('HomeCtrl', HomeCtrl);
HomeCtrl.$inject = ['appUserService', 'listEnviesService', '$location'];
function HomeCtrl(appUserService, listEnviesService, $location) {
    var vm = this;
    vm.loading = true;
    vm.envies = listEnviesService.query();

    vm.envies.$promise.then(function () {
        vm.loading = false;
    });
    /** Deprecated */
    vm.addUser = function (newuser) {
      appUserService.save(newuser, function() {
          vm.listeUser = appUserService.query();
      });
    };
    vm.goList = function (name) {
        $location.url("/"+name);
    };
}