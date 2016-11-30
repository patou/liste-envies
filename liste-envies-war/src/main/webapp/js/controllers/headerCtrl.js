app.controller('HeaderCtrl', function($scope, $http, $location, AuthService) {
    AuthService.refresh();
    var vm = this;
    vm.isActive = function(viewLocation) {
        return viewLocation === $location.path();
    };

    vm.user = AuthService.getUser();
    $scope.$watch(function () { return AuthService.getUser(); }, function () {
        vm.isAuthenticated = AuthService.isAuthenticated();
        vm.isAdmin = AuthService.isAdmin();
        vm.user = AuthService.getUser();
    });

    vm.loginPath = function() {
        return "/login?path=" + $location.path();
    };
    vm.logoutPath = function() {
        return "/logout?path=" + $location.path();
    };

});
