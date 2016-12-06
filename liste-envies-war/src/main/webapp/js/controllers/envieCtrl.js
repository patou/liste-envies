app.controller('EnvieCtrl', EnvieCtrl);
EnvieCtrl.$inject = ['envieService', 'appUserService', 'listEnviesService', '$routeParams', '$location', '$anchorScroll', '$scope'];
function EnvieCtrl(envieService, appUserService, listEnviesService, $routeParams, $location, $anchorScroll, $scope) {
    var vm = this;
    vm.name = $routeParams.name;
    vm.listEnvies = loadListEnvies(vm.name);

    vm.loading = true;
    vm.newUser = {email: '', type:'SHARED'};
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
        if (!envie.id) {
            vm.envies.push(envie);
            $scope.masonry.update();
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

    isStamped = false;

    vm.openComment = function(id) {

        const commentId = $("#comment-"+id);

        var $element = $("#envie"+id);

        // stamp or unstamp element to rest in place.
        if ( $scope.masonry.stamps.indexOf($element) ) {
            $scope.masonry.unstamp( $element );
            isStamped = false;
        } else {
            $scope.masonry.stamp( $element );
            isStamped = true;
        }

        commentId.collapse('toggle').promise().done(function () {
            $scope.masonry.layout();
            clearInterval(intervalUpdate);
        });

        // Expand
        var intervalUpdate = setInterval(function () {
            // trigger layout
            $scope.masonry.layout();
        }, 100);
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
            var pushUser = {};
            pushUser.email = newUser.email;
            pushUser.type = newUser.type;
            vm.listEnvies.users.push(pushUser);
        }
        newUser = {email: '', type:'SHARED'};
        vm.newUser = newUser;
    };

    vm.saveListEnvies = function(listEnvies) {
        if (vm.newUser.email) {
            vm.shareUser(vm.newUser);
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

    vm.sortList = function(property, elemt) {
        vm.order = (vm.order == property)? '-'+property : property;
        console.log('Sort List : ', vm.order, elemt);
        elemt.update();
    }

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
    vm.userName = function(email) {
        return loadUser(email).name;
    };
    function loadListEnvies(name) {
        return listEnviesService.get({name:name});
    }
    function loadEnvies() {
        vm.envies = envieService.query({name: $routeParams.name});
        vm.envies.$promise.then(function(list) {
            vm.loading = false;
            angular.forEach(list, function(item) {
                if (item.owner) {
                    item.ownerUser = loadUser(item.owner);
                }
                if (item.userTake) {
                    var userTakeNames = [];
                    angular.forEach(item.userTake, function(user) {
                        this.push(loadUser(user).name || user)
                    }, userTakeNames);
                    item.userTakeUsers = userTakeNames.join(", ");
                }

                $scope.$emit('masonry.layout');
                $scope.update();
            });
        });
    }
}