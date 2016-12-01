app.controller('EnvieCtrl', EnvieCtrl);
EnvieCtrl.$inject = ['envieService', 'appUserService', '$routeParams', '$location', '$anchorScroll'];
function EnvieCtrl(envieService, appUserService, $routeParams, $location, $anchorScroll) {
    var vm = this;
    vm.email = $routeParams.email;
    vm.user = loadUser(vm.email);

    vm.loading = false;
    loadListeEnvies();
    resetForm();

    vm.editEnvie = function (envie) {
        vm.envie = envie;
        gotoForm();
        return true;
    };

    vm.addEnvie = function (envie) {
        envieService.save({email:vm.email}, envie, function() {
            loadListeEnvies();
            gotoEnvie(envie.id);
            resetForm();
        });
    };

    vm.addNote = function (envie, notetext) {

        var note = {text: notetext.text};

        console.log('add Note', note, envie.id);

        envieService.addNote({email:vm.email, id: envie.id}, note, function() {
            loadListeEnvies();
            gotoEnvie(envie.id);
            vm.text = '';
        });
    };

    vm.given = function(id) {
        envieService.give({email:vm.email, id:id}, {}, function() {
            loadListeEnvies();
        });
    };

    vm.cancel = function(id) {
        envieService.cancel({email:vm.email, id:id}, {}, function() {
            loadListeEnvies();
        });
    };

    vm.openComment = function(index) {
        $("#comment-"+index).collapse('toggle');
    };

    function gotoForm() {
        // call $anchorScroll()
        $anchorScroll('formEdit');
    }

    function gotoEnvie(id) {
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash('envie'+id);

        // call $anchorScroll()
        $anchorScroll();
    }

    function resetForm() {
        vm.envie = {};
    }

    function loadUser(email) {
        return appUserService.get({email:email});
    }
    function loadListeEnvies() {
        vm.loading = true;
        vm.listeEnvies = envieService.query({email: $routeParams.email});
        vm.listeEnvies.$promise.then(function(list) {
            vm.loading = false;
            angular.forEach(list, function(item) {
                if (item.userTake) {
                    item.userTakeUser = loadUser(item.userTake);
                }
            });
        });
    }
}