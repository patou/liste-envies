app.controller('EnvieCtrl', EnvieCtrl);
EnvieCtrl.$inject = ['envieService', 'appUserService', 'listEnviesService', '$routeParams', '$location', '$anchorScroll'];
function EnvieCtrl(envieService, appUserService, listEnviesService, $routeParams, $location, $anchorScroll) {
    var vm = this;
    vm.name = $routeParams.name;
    vm.listEnvies = loadListEnvies(vm.name);

    vm.loading = true;
    loadEnvies();
    resetForm();

    vm.editEnvie = function (envie) {
        vm.envie = envie;
        gotoForm();
        return true;
    };

    vm.addEnvie = function (envie) {
        if (vm.link) {
            vm.addLink(vm.link);
        }
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
        if (vm.newEmail.email) {
            vm.shareUser(vm.newEmail);
        }
        listEnviesService.save(listEnvies, function(listEnvies) {
            vm.listEnvies = listEnvies;
            $("#share-list").modal("hide");
            vm.editTitle = false;
        });
    };

    vm.addLink = function(link) {
        if (!vm.envie.urls) {
           vm.envie.urls = [];
        }
        vm.envie.urls.push(link);
        vm.link = undefined;
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
        var foundUser = {email: email, name: ''};
        angular.forEach(vm.listEnvies.users, function(user) {
            if (user.email == email) {
                foundUser.name = user.name;
            }
        });
        return foundUser;
    }
    function loadListEnvies(name) {
        return listEnviesService.get({name:name});
    }
    function loadEnvies() {
        vm.envies = envieService.query({name: $routeParams.name});
        vm.envies.$promise.then(function(list) {
            vm.loading = false;
            angular.forEach(list, function(item) {
                if (item.userTake) {
                    var userTakeNames = [];
                    angular.forEach(item.userTake, function(user) {
                        this.push(loadUser(user).name || user)
                    }, userTakeNames);
                    item.userTakeUsers = userTakeNames.join(", ");
                }
            });
        });
    }
}