/**
 * @ngdoc directive
 * @name list-envie:pageDirective
 *
 * @description
 *
 *
 * @restrict A
 * */
angular.module('ListeEnviesDirectives')
    .directive('page', function () {
        return {
            restrict: 'E',
            transclude: true,
            link: function (scope, elem, attr) {

            }
        };
});
