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
        bindings: {
            whishName: '<',
            show: '<',
            onCancel: '&',
            onDelete: '&'
        }

    });
CancelDirectivesController.$inject = ['$timeout'];
function CancelDirectivesController ($timeout) {
    var vm = this;

    vm.$onChanges = function (changesObj) {
        if (changesObj.show && changesObj.show.currentValue) {
            vm.timeout = $timeout(vm.delete, 5000);
        }
    };
    vm.cancelDelete = function() {
        if (vm.timeout) {
            $timeout.cancel(vm.timeout);
        }
        vm.onCancel();
    };

    vm.delete = function() {
        vm.onDelete();
    };
}