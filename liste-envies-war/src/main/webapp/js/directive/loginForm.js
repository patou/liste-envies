angular.module('ListeEnviesDirectives')
    .directive('loginForm', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/directive/login-form.html',
            bindToController: true,
            controllerAs: 'w',
            controller: LoginForm,
            scope: {
            }
        };
    });

LoginForm.$inject = ['$location'];
function LoginForm($location) {
    var vm = this;

    vm.loginPath = function() {
        return "/user/login?path=" + encodeURIComponent($location.path());
    };
}