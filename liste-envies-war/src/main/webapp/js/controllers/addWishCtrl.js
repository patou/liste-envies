app.controller('AddWishCtrl', AddWishCtrl);
AddWishCtrl.$inject = ['UtilitiesServices', 'appUserService', 'listEnviesService', '$routeParams', '$location', '$anchorScroll', '$scope', '$parse', '$interval', '$timeout', '$filter'];
function AddWishCtrl(UtilitiesServices, appUserService, listEnviesService, $routeParams, $location, $anchorScroll, $scope, $parse, $interval, $timeout, $filter) {
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

    vm.newWish = {};
    if ($routeParams.title || $routeParams.url) {
        vm.newWish.external = true;
        if ($routeParams.title)
        {
            vm.newWish.label = $routeParams.title;
        }
        if ($routeParams.url)
        {
            vm.newWish.urls = [{url: $routeParams.url, name:null}];
        }
    }

    UtilitiesServices.getList().then(function (data) {
        vm.wishLists = data;
    });


    vm.addEnvie = function (envie) {
        $location.url("/"+vm.name);
    };








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




    $.material.init();
}