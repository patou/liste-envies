app.controller('HomeCtrl', function ($scope, $http, AuthService, appUserService) {
    AuthService.refresh();
    var vm = this;
    vm.user = AuthService.getUser();
    $scope.$watch(function () { return AuthService.getUser(); }, function () {
        vm.user = AuthService.getUser();
    });
    vm.listeUser = appUserService.query();
});