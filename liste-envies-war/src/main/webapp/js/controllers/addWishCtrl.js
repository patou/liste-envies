app.controller('AddWishCtrl', AddWishCtrl);
AddWishCtrl.$inject = ['envieService', 'appUserService', 'listEnviesService', '$routeParams', '$location', '$anchorScroll', '$scope', '$parse', '$interval', '$timeout', '$filter'];
function AddWishCtrl(envieService, appUserService, listEnviesService, $routeParams, $location, $anchorScroll, $scope, $parse, $interval, $timeout, $filter) {
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





    vm.filterProperties = [{owner: true, shared: true, expression:'true', label:'Toutes', class:'btn-white btn-bordered-primary'},
        {owner: false, shared: true, expression:'userTake.length > 0', label:'Offerts', class:'btn-white btn-bordered-warning'},
        {owner: false, shared: true, expression:'userTake.length == 0', label:'A offrir', class:'btn-white btn-bordered-success', child: [
            {role: "filter", expression:'userTake.length == 0 && suggest == true', label:'Suggestion', class:'btn-white btn-bordered-info'},
            {role: "filter", expression:'userTake.length == 0 && suggest == false ', label:'Envie', class:'btn-white btn-bordered-success'}
        ]},
        {owner: false, shared: true, expression:'notes.length > 0', label:'Commentaires', class:'btn-white btn-bordered-danger'},
        {owner: true, shared: false, expression:'description == null || price == null || picture == null || urls == null', label:'A compléter', class:'btn-white btn-bordered-danger', child: [
            {role: "filter", expression:'description == null', label:'Sans texte', class:'btn-white btn-bordered-danger'},
            {role: "filter", expression:'price == null', label:'Sans prix', class:'btn-white btn-bordered-danger'},
            {role: "filter", expression:'picture == null', label:'Sans image', class:'btn-white btn-bordered-danger'},
            {role: "filter", expression:'urls == null', label:'Sans lien', class:'btn-white btn-bordered-danger'}
        ]},

        {owner: true, shared: true, expression:'rating > 0', label:'Note', class:'btn-white btn-bordered-upgrade', child: vm.filtersRatingList},
        {owner: true, shared: true, expression:'price != null', label:'Prix', class:'btn-white btn-bordered-gray', child: vm.filtersPriceList}
        ];




    resetForm();



    vm.addEnvie = function (envie) {
            vm.envies.push(envie);
            $scope.update();
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