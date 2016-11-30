app.controller('HomeCtrl', HomeCtrl);
HomeCtrl.$inject = ['appUserService', '$location'];
function HomeCtrl(appUserService, $location) {
    var vm = this;
    vm.listeUser = appUserService.query();
    vm.addUser = function (newuser) {
      appUserService.save(newuser, function() {
          vm.listeUser = appUserService.query();
      });
    };
    vm.goList = function (email) {
        $location.url("/"+email);
    };
}