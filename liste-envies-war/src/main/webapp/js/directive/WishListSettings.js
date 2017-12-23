angular.module('ListeEnviesDirectives')
    .directive('wishListSettings', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/directive/WishListSettings.html',
            bindToController: true,
            controllerAs: 'w',
            controller: WishListSettings,
            scope: {
                'wishList': '=',
                'backgroundChange': '&'
            }
        };
    });

WishListSettings.$inject = ['WishListTypePicture'];
function WishListSettings(WishListTypePicture) {
    var vm = this;
    vm.WishListTypePicture = WishListTypePicture;

    vm.changeBackground = function(picture) {
        vm.wishList.picture = picture;
        if (!picture) {
            return;
        }
        vm.backgroundChange({picture:picture});
    }
}