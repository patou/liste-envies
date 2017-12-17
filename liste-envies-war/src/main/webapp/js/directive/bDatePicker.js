angular.module('ListeEnviesDirectives').directive('bDatepicker', function(){
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function ($scope, element, attrs, controller) {
            var updateModel, onblur;

            if (controller != null) {

                updateModel = function (event) {
                    element.datepicker('hide');
                    element.blur();
                };

                onblur = function () {
                    //we'll update the model in the blur() handler
                    //because it's possible the user put in an invalid date
                    //in the input box directly.
                    //Bootstrap datepicker will have overwritten invalid values
                    //on blur with today's date so we'll stick that in the model.
                    //this assumes that the forceParse option has been left as default(true)
                    //https://github.com/eternicode/bootstrap-datepicker#forceparse
                    var date = element.val();
                    return $scope.$apply(function () {
                        return controller.$setViewValue(date);
                    });
                };

                controller.$render = function () {
                    var date = controller.$viewValue;
                    if (angular.isDefined(date) && date != null && angular.isDate(date))
                    {
                        element.datepicker().data().datepicker.date = date;
                        element.datepicker('setValue');
                        element.datepicker('update');
                    } else if (date) {
                        throw new Error('ng-Model value must be a Date object - currently it is a ' + typeof date + ' - use ui-date-format to convert it from a string');
                    }
                    return controller.$viewValue;
                };
            }
            return attrs.$observe('bdatepicker', function (value) {
                var options;
                options = {}; //<--- insert your own defaults here!
                if (angular.isObject(value)) {
                    options = value;
                }
                if (typeof (value) === "string" && value.length > 0) {
                    options = angular.fromJson(value);
                }
                return element.datepicker(options).on('changeDate', updateModel).on('blur', onblur);
            });
        }
    };
});