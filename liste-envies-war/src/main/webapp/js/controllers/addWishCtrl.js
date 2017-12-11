app.controller('AddWishCtrl', AddWishCtrl);
AddWishCtrl.$inject = ['UtilitiesServices', 'appUserService', 'listEnviesService', '$routeParams', '$location', '$anchorScroll', '$scope', '$parse', '$interval', '$timeout', 'pageInfo'];
function AddWishCtrl(UtilitiesServices, appUserService, listEnviesService, $routeParams, $location,
                     $anchorScroll, $scope, $parse, $interval, $timeout, pageInfo) {
    var vm = this;
    //vm.name = $routeParams.name;

    vm.loading = true;

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

    vm.added = false;


    vm.newWish = {};

    if (pageInfo && pageInfo.data) {
        //pageInfo = pageInfo.data;
        vm.newWish.external = true;
        vm.newWish.label = $routeParams.title? $routeParams.title : pageInfo.title;
        vm.newWish.urls = [{url: pageInfo.url, name:pageInfo.domain}];

        if (pageInfo.domain.indexOf('amazon') > 0 && pageInfo.lead_image_url) { // case for amazon, that can have sometimes a list of images url.
            var spiltedImage = pageInfo.lead_image_url.split('%22');
            if (spiltedImage.length > 1) {
                vm.newWish.picture =  spiltedImage[1];
            } else if (spiltedImage.length === 0) {
                vm.newWish.picture =  spiltedImage[0];
            } else {
                vm.newWish.picture =  pageInfo.lead_image_url;
            }

        } else {
            vm.newWish.description =  pageInfo.excerpt;
            vm.newWish.picture =  pageInfo.lead_image_url? pageInfo.lead_image_url : null;
        }

    } else if ($routeParams.title || $routeParams.url) {
        vm.newWish.external = true;
        if ($routeParams.title)
        {
            vm.newWish.label = $routeParams.title;
        }
        if ($routeParams.url)
        {
            vm.newWish.urls = [{url: $routeParams.url, name:null}];
        }
    } else if (window.wish) {
        var savedWish = window.wish;
        savedWish.external = true;

        vm.newWish = savedWish;
    }

    UtilitiesServices.getList().then(function (data) {
        vm.wishLists = data;
    });


    vm.addEnvie = function (envie) {
        vm.newWish = envie;
        vm.added = true;
        $anchorScroll();
        $anchorScroll('add_wish_top');
        //updateWishUser(vm.newWish);
        //$location.url("/"+vm.name);
    };

    vm.closeWithDelay = function() {
        setTimeout(function () {
            window.close();
        }, 200);
    }








    vm.selectedItems = null;



    var intervalUpdate;
    var timeoutUpdate;
    vm.refreshingLayoutAuto = function (delay, end) {
        if (intervalUpdate) $interval.cancel(intervalUpdate);

        intervalUpdate = $interval(function () {
            // trigger layout
            $scope.masonry.layout();
        }, delay, 50);

        if (!end) end = 500;

        timeoutUpdate = $timeout(function () {
            vm.clearRefreshingLayoutAuto();
        }, end);
    };

    vm.clearRefreshingLayoutAuto = function () {
        if (intervalUpdate) $interval.cancel(intervalUpdate);
        if (timeoutUpdate) $timeout.cancel(timeoutUpdate);

        intervalUpdate = null;
        $scope.masonry.layout();
    };

    vm.refreshLayout = function (delay) {
        vm.refreshingLayoutAuto(30, delay);
    };


    vm.stampElement = function (id, refresh) {
        if (!refresh) refresh = true;
        var $element = $("#envie"+id);
        // stamp or unstamp element to rest in place.
        if (!$scope.masonry.stamps.indexOf($element) ) {
            $scope.masonry.stamp( $element );
        }
        refresh && vm.refreshLayout(200);

    };

    vm.unStampElement = function (id, refresh) {
        if (!refresh) refresh = true;
        var $element = $("#envie"+id);
        // stamp or unstamp element to rest in place.
        if ( $scope.masonry.stamps.indexOf($element) ) {
            $scope.masonry.unstamp($element);
        }
        refresh && vm.refreshLayout(200);
    };






    /**
     * Function to update a wish, whithout changing the js link.
     * @param target
     * @param source
     */
    vm.updatePropertiesWish = function (target, source) {
        if (!target && !source && target !== undefined) return;
        /*for(var propertyName in source) {
            // propertyName is what you want
            // you can get the value like this: myObject[propertyName]
            target[propertyName] = source[propertyName];
        }*/
        target = angular.merge(target, source);
        target.userTake = source.userTake;
        updateWishUser(target);
        return target;
    };



    function resetForm() {
        vm.newWish = {};
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

    var updateWishUser = function (item) {
        if (item.owner) {
            item.ownerUser = loadUser(item.owner);
        }
        if (item.userTake && item.userTake.length > 0) {
            var userTakeNames = [];
            angular.forEach(item.userTake, function (user) {
                this.push(loadUser(user).name || user);
            }, userTakeNames);
            item.userTakeUsers = userTakeNames.join(", ");
        } else {
            //delete item.userTake;
            delete item.userTakeUsers;
        }
    };




    $.material.init();
}