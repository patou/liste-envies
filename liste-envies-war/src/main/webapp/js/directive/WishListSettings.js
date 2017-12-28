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
    vm.editorOptions = {
        disableDragAndDrop: true,
        disableResizeEditor: true,
        placeholder: "Ajouter une description",
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear', 'color', 'fontsize']],
            ['para', ['ul', 'ol', 'paragraph']]
        ],
        popover: {
            image: [
                ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
                ['float', ['floatLeft', 'floatRight', 'floatNone']],
                ['remove', ['removeMedia']]
            ],
            link: [
                ['link', ['linkDialogShow', 'unlink']]
            ],
            air: [
                ['style', ['bold', 'italic', 'underline', 'clear', 'color', 'fontsize']],
                ['para', ['ul', 'ol', 'paragraph']]
            ]
        },
        height: 100
    };
    vm.changeBackground = function(picture) {
        vm.wishList.picture = picture;
        if (!picture) {
            return;
        }
        vm.backgroundChange({picture:picture});
    }
}