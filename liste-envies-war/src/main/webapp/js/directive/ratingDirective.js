// http://angulartutorial.blogspot.com/2014/03/rating-stars-in-angular-js-using.html


angular.module('ListeEnviesDirectives')
    .directive('starRating', starRating);

function starRating() {
    return {
        restrict: 'EA',
        template:
        '<ul class="star-rating" ng-class="{readonly: readonly}">' +
        '  <li ng-click="cancel()" ng-if="!readonly" class="cancel-rating">' +
        '    <i class="fa fa-times-circle"></i>' + // or &#9733
        '  </li>' +
        '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
        '    <i class="fa fa-heart"></i>' + // or &#9733
        '  </li>' +
        '</ul>',
        scope: {
            ratingValue: '=ngModel',
            max: '=?', // optional (default is 5)
            onRatingSelect: '&?',
            readonly: '=?'
        },
        link: function(scope, element, attributes) {
            if (scope.max == undefined) {
                scope.max = 5;
            }

            function updateStars() {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            }
            scope.toggle = function(index) {
                if (scope.readonly == undefined || scope.readonly === false){
                    scope.ratingValue = index + 1;
                    scope.onRatingSelect({
                        rating: index + 1
                    });
                }
            };
            scope.cancel = function() {
                if (scope.readonly == undefined || scope.readonly === false){
                    scope.ratingValue = 0;
                    scope.onRatingSelect({
                        rating: 0
                    });
                }
            };
            scope.$watch('ratingValue', function(oldValue, newValue) {
                if (newValue >= 0) {
                    updateStars();
                }
            });
        }
    };
}
