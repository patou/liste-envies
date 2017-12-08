app.controller('ProfilCtrl', ProfilCtrl);
ProfilCtrl.$inject = ['appUserService','$scope', 'AuthService', '$location'];
function ProfilCtrl(appUserService, $scope, AuthService, $location) {
    var vm = this;
    vm.loading = true;

    vm.saveUser = function () {
      vm.loading = false;
      appUserService.save(vm.user, function(user) {
          vm.loading = true;
          AuthService.refresh().then(function() {
              $location.url("/");
          });
      });
    };

    appUserService.my().$promise.then(function(u) {
        if (u.birthday) {
            u.birthday = new Date(u.birthday);
        }
        vm.user = u;

    });


    $scope.$on('$viewContentLoaded', function() {
        console.log('on init');
        $.material.init();
    });

}