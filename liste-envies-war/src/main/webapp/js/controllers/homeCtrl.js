app.controller('HomeCtrl', HomeCtrl);
HomeCtrl.$inject = ['appUserService', 'wishListService', '$location', 'UtilitiesServices', 'AuthService', 'WishListTypePicture'];
function HomeCtrl(appUserService, wishListService, $location, UtilitiesServices, AuthService, WishListTypePicture) {
    var vm = this;
    vm.loading = true;
    resetBackground();

    UtilitiesServices.getList().then(function (data) {
        vm.loading = false;
        vm.wishes = data;
    });
    /** Deprecated */
    vm.addUser = function (newuser) {
      appUserService.save(newuser, function() {
          vm.listeUser = appUserService.query();
      });
    };
    vm.goList = function (name) {
        $location.url("/"+name);
    };

    vm.addNewList = function (newlist, userEmail) {
        $('#new-list').modal('hide');
        vm.loading = true;
        if (userEmail == null) {
            const currentUser = AuthService.getUser();
            userEmail = currentUser.email;
        }
        var user = [];
        user.push({'email': userEmail, 'type': "OWNER"});
        if (newlist.emails && newlist.emails.length > 0) {
            newlist.emails.split(/[\n\s,;]+/).map(function (email) {
                user.push({'email': email.trim(), 'type': "SHARED"});
            });
        }
        var newWishList = {title: newlist.title, users:user, privacy: newlist.privacy, date: newlist.date, type: newlist.type};
        if (newlist.picture) {
           newWishList.picture = newlist.picture;
           resetBackground();
        }
        wishListService.save(newWishList, function(wishList) {
            vm.loading = false;
            $location.url("/"+wishList.name);
        });
    };

    $.material.init();


    function resetBackground() {
        vm.background = 'img/default.jpg';
    }
    $("#new-list").on("hidden.bs.modal", function(e) {
       resetBackground();
       $('body').removeClass('modal-open'); // bug this css class is not removed and the modal will block the pages
        vm.$scope.$digest();
    });
    vm.changeBackground = function(picture) {
        vm.newlist.picture = picture;
        if (!picture) {
            resetBackground();
            return;
        }
        vm.background = picture;
    }
}