/**
 * @ngdoc directive
 * @name directives:cancelDirective
 *
 * @description
 *
 *
 * @restrict A
 * */
angular.module('ListeEnviesDirectives')
    .component('cancelDirective', {
        templateUrl: 'templates/directive/cancelDirective.html',
        controller: CancelDirectivesController,
        controllerAs: 'vm',
        transclude: true,
        bindings: {
            title: '@',
            type: '@',
            show: '<',
            onCancel: '&',
            onDelete: '&'
        }
    });
CancelDirectivesController.$inject = ['$timeout'];
function CancelDirectivesController ($timeout) {
    var vm = this;

    vm.$onChanges = function (changesObj) {
        cancelTimeout();
        if (changesObj.show && changesObj.show.currentValue) {
            vm.timeout = $timeout(vm.delete, 5000);
        }
    };
    vm.cancelDelete = function() {
        cancelTimeout();
        vm.onCancel();
    };

    vm.delete = function() {
        cancelTimeout();
        vm.onDelete();
    };

    function cancelTimeout() {
        if (vm.timeout) {
            $timeout.cancel(vm.timeout);
        }
    }
}