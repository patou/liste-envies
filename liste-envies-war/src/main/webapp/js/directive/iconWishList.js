// http://angulartutorial.blogspot.com/2014/03/rating-stars-in-angular-js-using.html


angular.module('ListeEnviesDirectives').component('iconWishList', {
    template:
    '<span class="fa {{vm.getClass()}}" translate translate-attr-title="WISH_LIST_PAGE.UPDATE_LIST.TYPE.{{vm.TYPE}}">' +
    '</span>',
    controller: IconWishList,
    controllerAs: 'vm',
    bindings: {
        type: '@'
    }
});

function IconWishList() {
    var vm = this;

    vm.getClass = function () {
        switch (vm.type) {
            case "CHRISTMAS":
                return "fa-tree";

                case "BIRTHDAY":
                return "fa-birthday-cake";

                case "BIRTH":
                return "fa-child";

                case "WEDDING":
                return "fa-circle-thin";

                case "LEAVING":
                return "fa-plane";

                case "SPECIAL_OCCASION":
                return "fa-magic";

                case "HOUSE_WARNING":
                return "fa-home";

                case "RETIREMENT":
                return "fa-globe";

                case "OTHER":
                return "fa-gift";

        }
    }
}
