app.controller('EnvieCtrl', EnvieCtrl);
EnvieCtrl.$inject = ['envieService', 'appUserService', 'listEnviesService', '$routeParams', '$location', '$anchorScroll', '$scope', '$parse'];
function EnvieCtrl(envieService, appUserService, listEnviesService, $routeParams, $location, $anchorScroll, $scope, $parse) {
    var vm = this;
    vm.name = $routeParams.name;
    vm.listEnvies = loadListEnvies(vm.name);
    vm.loading = true;
    vm.newUser = {email: '', type:'SHARED'};
    vm.editorOptions = {
        disableDragAndDrop: true,
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
        height: 200
    };
    vm.orderProperties = [{property:'label', label:'Titre'},
        {property:'date', label:'Date'},{property:'price', label:'Prix'},
        {property:'-userTakeUsers', label:'Offert'},
        {property:'-notes.length', label:'Commentaires'}];

    vm.orderPropertiesOwners = [{property:'label', label:'Titre'},
        {property:'date', label:'Date'},
        {property:'price', label:'Prix'}];

    vm.filterProperties = [{expression:'true', label:'Toutes', class:'btn-default'},
        {expression:'userTake.length > 0', label:'Offerts', class:'btn-warning'},
        {expression:'userTake.length == 0', label:'A offrir', class:'btn-success'},
        {expression:'suggest == true', label:'Suggestion', class:'btn-info'},
        {expression:'notes.length > 0', label:'Commentaires', class:'btn-warning'}];
    vm.filterPropertiesOwners = [{expression:'true', label:'Toutes', class:'btn-default'},
        {expression:'description == null', label:'Sans description', class:'btn-default'},
        {expression:'price == null', label:'Sans prix', class:'btn-default'},
        {expression:'picture == null', label:'Sans images', class:'btn-default'},
        {expression:'urls == null', label:'Sans liens', class:'btn-default'}];
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

    vm.sortList = function(property) {
        var reversePropertie = (property.indexOf('-'))? property.replace('-', '') : '-'+property;
        vm.order = (vm.order == property)? reversePropertie : property;

        $scope.update();
    };

    vm.filterList = function(expr) {
        var expression = $parse(expr)
        vm.filter = function(value) {
            return expression(value);
        };
        $scope.update();
    };

    vm.searchList = function(search) {
        var expression;
        if (search == '') {
            expression = function () {
                return true;
            };
        } else {
            expression = {$: search};
        }
        vm.filter = expression;
        $scope.update();
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