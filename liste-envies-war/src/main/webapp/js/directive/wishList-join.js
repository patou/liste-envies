angular.module('ListeEnviesDirectives')
    .directive('joinForm', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/directive/wishList-join.html',
            bindToController: true,
            controllerAs: 'w',
            controller: joinForm,
            scope: {
                "name": "@",
                "update": "&"
            }
        };
    });

joinForm.$inject = ['wishListService'];
function joinForm(wishListService) {
    var vm = this;

    vm.join = function() {
        wishListService.join({name: vm.name}).$promise.then(function() {
            vm.update();
        });
    };
}