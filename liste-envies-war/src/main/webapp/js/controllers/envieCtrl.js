app.controller('EnvieCtrl', EnvieCtrl);
EnvieCtrl.$inject = ['envieService', 'appUserService', 'listEnviesService', '$routeParams', '$location', '$anchorScroll'];
function EnvieCtrl(envieService, appUserService, listEnviesService, $routeParams, $location, $anchorScroll) {
    var vm = this;
    vm.name = $routeParams.name;
    vm.listEnvies = loadListEnvies(vm.name);

    vm.loading = false;
    loadEnvies();
    resetForm();

    vm.editEnvie = function (envie) {
        vm.envie = envie;
        gotoForm();
        return true;
    };

    vm.addEnvie = function (envie) {
        envieService.save({name:vm.name}, envie, function() {
            loadEnvies();
            gotoEnvie(envie.id);
            resetForm();
        });
    };

    vm.addNote = function (envie, notetext) {

        var note = {text: notetext.text};

        console.log('add Note', note, envie.id);

        envieService.addNote({name:vm.name, id: envie.id}, note, function() {
            loadEnvies();
            gotoEnvie(envie.id);
            vm.text = '';
        });
    };

    vm.given = function(id) {
        envieService.give({name:vm.name, id:id}, {}, function() {
            loadEnvies();
        });
    };

    vm.cancel = function(id) {
        envieService.cancel({name:vm.name, id:id}, {}, function() {
            loadEnvies();
        });
    };

    vm.openComment = function(index) {
        $("#comment-"+index).collapse('toggle');
    };

    vm.removeUser = function(user) {
        var index = vm.listEnvies.users.indexOf(user);
        if (index >= 0)
            vm.listEnvies.users.splice(index, 1);
    };

    vm.shareUser = function(newUser) {
        if (!newUser.type) {
            newUser.type = 'SHARED';
        }
        if (newUser.email && newUser.email.indexOf('@') > 0) {
            vm.listEnvies.users.push(newUser);
            vm.newUser = {type:'SHARED'};
        }
    };

    vm.saveListEnvies = function(listEnvies) {
        listEnviesService.save(listEnvies, function(listEnvies) {
            vm.listEnvies = listEnvies;
            $("#share-list").modal("hide");
            vm.editTitle = false;
        });
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
    function loadListEnvies(name) {
        return listEnviesService.get({name:name});
    }
    function loadEnvies() {
        vm.loading = true;
        vm.envies = envieService.query({name: $routeParams.name});
        vm.envies.$promise.then(function(list) {
            vm.loading = false;
            angular.forEach(list, function(item) {
                if (item.userTake) {
                    item.userTakeUser = loadUser(item.userTake);
                }
            });
        });
    }
}