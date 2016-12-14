app.controller('HomeCtrl', HomeCtrl);
HomeCtrl.$inject = ['appUserService', 'listEnviesService', '$location', 'UtilitiesServices'];
function HomeCtrl(appUserService, listEnviesService, $location, UtilitiesServices) {
    var vm = this;
    vm.loading = true;

    UtilitiesServices.getList().then(function (data) {
        vm.loading = false;
        vm.envies = data;
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
        var user = [];
        user.push({'email': userEmail, 'type': "OWNER"});
        if (newlist.emails && newlist.emails.length > 0) {
            newlist.emails.split(/[\n\s,]+/).map(function (email) {
                user.push({'email': email.trim(), 'type': "SHARED"});
            });
        }
        listEnviesService.save({title: newlist.title, users:user}, function(listEnvies) {
            $location.url("/"+listEnvies.name);
        });
    };

    $.material.init();
}