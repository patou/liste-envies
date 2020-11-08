app.controller("ListCtrl", ListCtrl);
ListCtrl.$inject = [
  "wishService",
  "appUserService",
  "wishListService",
  "$routeParams",
  "$location",
  "$anchorScroll",
  "$scope",
  "$parse",
  "$interval",
  "$timeout",
  "$filter",
  "UtilitiesServices",
];

function ListCtrl(
  wishService,
  appUserService,
  wishListService,
  $routeParams,
  $location,
  $anchorScroll,
  $scope,
  $parse,
  $interval,
  $timeout,
  $filter,
  UtilitiesServices
) {
  var vm = this;
  vm.name = $routeParams.name;
  vm.wishList = loadWishList(vm.name);
  vm.hasFilter = false;
  vm.loading = true;
  masonry = null;
  vm.newUser = { email: "", type: "SHARED" };
  vm.url = $location.protocol() + "://" + $location.host();
  vm.newUrl = vm.name;

  vm.editorOptions = {
    disableDragAndDrop: true,
    placeholder: "Ajouter une description",
    toolbar: [
      ["style", ["bold", "italic", "underline", "clear", "color", "fontsize"]],
      ["para", ["ul", "ol", "paragraph"]],
      ["insert", ["link", "picture"]],
    ],
    popover: {
      image: [
        ["imagesize", ["imageSize100", "imageSize50", "imageSize25"]],
        ["float", ["floatLeft", "floatRight", "floatNone"]],
        ["remove", ["removeMedia"]],
      ],
      link: [["link", ["linkDialogShow", "unlink"]]],
      air: [
        [
          "style",
          ["bold", "italic", "underline", "clear", "color", "fontsize"],
        ],
        ["para", ["ul", "ol", "paragraph"]],
        ["insert", ["link", "picture"]],
      ],
    },
    height: 200,
  };

  var orderPrice = function (value) {
    var price = value.price;
    if (!price) return vm.reverse ? -1 : 99999999;

    var matches = price
      .replace(",", ".")
      .replace(" ", "")
      .match(/(\d+\.?\d+|\.\d+)/g);
    if (!matches) return vm.reverse ? -1 : 99999999;

    var valTri = matches.reduce(function (returnValue, currentValue) {
      if (typeof returnValue == "string") returnValue = parseFloat(returnValue);
      currentValue = parseFloat(currentValue);
      if (vm.reverse && returnValue > currentValue) {
        // If reverse find min
        return returnValue;
      } else if (!vm.reverse && returnValue < currentValue) {
        // If no reverse find max
        return returnValue;
      }
      return currentValue;
    });
    if (typeof valTri == "string") valTri = parseFloat(valTri);
    if (valTri >= 0) {
      return valTri;
    } else {
      return vm.reverse ? -1 : 99999999;
    }
  };
  vm.orderProperties = [
    { property: "label", label: "Titre", reverse: false, selected: false },
    { property: "date", label: "Date", reverse: true, selected: true },
    { property: orderPrice, label: "Prix", reverse: false, selected: false },
    { property: "rating", label: "Note", reverse: true, selected: false },
    {
      property: "userTakeUsers",
      label: "Offert",
      reverse: true,
      selected: false,
    },
    {
      property: function (value) {
        return value.comments ? value.comments.length : -1;
      },
      label: "Commentaires",
      reverse: true,
      selected: false,
    },
  ];

  vm.orderPropertiesOwners = [
    { property: "label", label: "Titre", reverse: false, selected: false },
    { property: "date", label: "Date", reverse: true, selected: false },
    { property: orderPrice, label: "Prix", reverse: false, selected: false },
  ];

  vm.filtersPriceList = [
    {
      role: "filter",
      type: "price",
      min: 0,
      max: 30,
      label: "Moins de 30 €",
      class: "",
    },
    {
      role: "filter",
      type: "price",
      min: 0,
      max: 50,
      label: "Moins de 50 €",
      class: "",
    },
    {
      role: "filter",
      type: "price",
      min: 0,
      max: 100,
      label: "Moins de 100 €",
      class: "",
    },
    {
      role: "filter",
      type: "price",
      min: 0,
      max: 200,
      label: "Moins de 200 €",
      class: "",
    },
    { role: "separator", class: "divider" },
    {
      role: "filter",
      type: "price",
      min: 30,
      max: 50,
      label: "entre 30 et 50 €",
      class: "",
    },
    {
      role: "filter",
      type: "price",
      min: 50,
      max: 100,
      label: "entre 50 et 100 €",
      class: "",
    },
    {
      role: "filter",
      type: "price",
      min: 100,
      max: 200,
      label: "entre 100 et 200 €",
      class: "",
    },
    { role: "separator", class: "divider" },
    {
      role: "filter",
      type: "price",
      min: 30,
      max: null,
      label: "Plus de 30 €",
      class: "",
    },
    {
      role: "filter",
      type: "price",
      min: 50,
      max: null,
      label: "Plus de 50 €",
      class: "",
    },
    {
      role: "filter",
      type: "price",
      min: 100,
      max: null,
      label: "Plus de 100 €",
      class: "",
    },
    {
      role: "filter",
      type: "price",
      min: 200,
      max: null,
      label: "Plus de 200 €",
      class: "",
    },
  ];

  vm.filtersRatingList = [
    {
      role: "filter",
      type: "rating",
      expression: "rating == 1",
      label: "1 coeur",
      class: "",
    },
    {
      role: "filter",
      type: "rating",
      expression: "rating == 2",
      label: "2 coeurs",
      class: "",
    },
    {
      role: "filter",
      type: "rating",
      expression: "rating == 3",
      label: "3 coeurs",
      class: "",
    },
    {
      role: "filter",
      type: "rating",
      expression: "rating == 4",
      label: "4 coeurs",
      class: "",
    },
    {
      role: "filter",
      type: "rating",
      expression: "rating == 5",
      label: "5 coeurs",
      class: "",
    },
    { role: "separator", class: "divider" },
    {
      role: "filter",
      type: "rating",
      expression: "rating >= 1",
      label: "plus de 1 coeurs",
      class: "",
    },
    {
      role: "filter",
      type: "rating",
      expression: "rating >= 2",
      label: "plus de 2 coeurs",
      class: "",
    },
    {
      role: "filter",
      type: "rating",
      expression: "rating >= 3",
      label: "plus de 3 coeurs",
      class: "",
    },
    {
      role: "filter",
      type: "rating",
      expression: "rating >= 4",
      label: "plus de 4 coeurs",
      class: "",
    },
    {
      role: "filter",
      type: "rating",
      expression: "rating >= 5",
      label: "plus de 5 coeurs",
      class: "",
    },
  ];

  vm.filterProperties = [
    {
      owner: true,
      shared: true,
      expression: "true",
      label: "Toutes",
      class: "btn-white btn-bordered-primary",
    },
    {
      owner: false,
      shared: true,
      expression: "userTake.length > 0",
      label: "Offerts",
      class: "btn-white btn-bordered-warning",
    },
    {
      owner: false,
      shared: true,
      expression: "userTake.length == 0",
      label: "A offrir",
      class: "btn-white btn-bordered-success",
      child: [
        {
          role: "filter",
          expression: "userTake.length == 0 && suggest == true",
          label: "Suggestion",
          class: "btn-white btn-bordered-info",
        },
        {
          role: "filter",
          expression: "userTake.length == 0 && suggest == false ",
          label: "Envie",
          class: "btn-white btn-bordered-success",
        },
      ],
    },
    {
      owner: false,
      shared: true,
      expression: "comments.length > 0",
      label: "Commentaires",
      class: "btn-white btn-bordered-danger",
    },
    {
      owner: true,
      shared: false,
      expression:
        "description == null || price == null || picture == null || urls == null",
      label: "A compléter",
      class: "btn-white btn-bordered-danger",
      child: [
        {
          role: "filter",
          expression: "description == null",
          label: "Sans texte",
          class: "btn-white btn-bordered-danger",
        },
        {
          role: "filter",
          expression: "price == null",
          label: "Sans prix",
          class: "btn-white btn-bordered-danger",
        },
        {
          role: "filter",
          expression: "picture == null",
          label: "Sans image",
          class: "btn-white btn-bordered-danger",
        },
        {
          role: "filter",
          expression: "urls == null",
          label: "Sans lien",
          class: "btn-white btn-bordered-danger",
        },
      ],
    },

    {
      owner: true,
      shared: true,
      expression: "rating > 0",
      label: "Note",
      class: "btn-white btn-bordered-upgrade",
      child: vm.filtersRatingList,
    },
    {
      owner: true,
      shared: true,
      expression: "price != null",
      label: "Prix",
      class: "btn-white btn-bordered-gray",
      child: vm.filtersPriceList,
    },
  ];

  loadWishes();
  resetForm();

  vm.update = function () {
    if (masonry) {
      masonry.update();
    }
  };

  vm.addWish = function (wish) {
    vm.wishes.push(wish);
    vm.update();
  };

  vm.resetFilter = function () {
    vm.filterList("true");
    vm.search = "";
  };

  vm.removeUser = function (user) {
    var index = vm.wishList.users.indexOf(user);
    if (index >= 0) vm.wishList.users.splice(index, 1);
  };

  vm.shareUser = function (newUser) {
    if (!newUser.type) {
      newUser.type = "SHARED";
    }
    if (newUser.email && newUser.email.indexOf("@") > 0) {
      var pushUser = {};
      pushUser.email = newUser.email.trim();
      pushUser.type = newUser.type;
      vm.wishList.users.push(pushUser);
    }
    newUser = { email: "", type: "SHARED" };
    vm.newUser = newUser;
  };

  vm.saveWishList = function (wishList) {
    if (vm.newUser.email) {
      vm.shareUser(vm.newUser);
    }
    wishListService.save(wishList, function (wishList) {
      vm.wishList = wishList;
      $("#share-list").modal("hide");
      $("#settings-list").modal("hide");
      hideModal();
      vm.editTitle = false;
      updateDate();

      UtilitiesServices.getList(true);
    });
  };

  function updateDate() {
    vm.wishList.dateTimeStamp = vm.wishList.date;
    if (vm.wishList.date) vm.wishList.date = new Date(vm.wishList.date);
  }

  vm.selectedItems = null;

  vm.sortList = function (order) {
    vm.order = order.property;
    vm.reverse = order.reverse;

    order.reverse = !order.reverse;
    order.selected = true;

    if (vm.selectedItems) vm.selectedItems.selected = false;

    vm.selectedItems = order;

    vm.update();
  };

  var intervalUpdate;
  var timeoutUpdate;
  vm.refreshingLayoutAuto = function (delay, end) {
    if (intervalUpdate) $interval.cancel(intervalUpdate);

    intervalUpdate = $interval(
      function () {
        // trigger layout
        if (masonry) masonry.layout();
      },
      delay,
      50
    );

    if (!end) end = 500;

    timeoutUpdate = $timeout(function () {
      vm.clearRefreshingLayoutAuto();
    }, end);
  };

  vm.clearRefreshingLayoutAuto = function () {
    if (intervalUpdate) $interval.cancel(intervalUpdate);
    if (timeoutUpdate) $timeout.cancel(timeoutUpdate);

    intervalUpdate = null;
    if (masonry) masonry.layout();
  };

  vm.refreshLayout = function (delay) {
    vm.refreshingLayoutAuto(30, delay);
  };

  vm.stampElement = function (id, refresh) {
    if (!refresh) refresh = true;
    var $element = $("#envie" + id);
    // stamp or unstamp element to rest in place.
    if (masonry && !masonry.stamps.indexOf($element)) {
      if (masonry) masonry.stamp($element);
    }
    refresh && vm.refreshLayout(200);
  };

  vm.unStampElement = function (id, refresh) {
    if (!refresh) refresh = true;
    var $element = $("#envie" + id);
    // stamp or unstamp element to rest in place.
    if (masonry && !masonry.stamps.indexOf($element)) {
      if (masonry) masonry.unstamp($element);
    }
    refresh && vm.refreshLayout(200);
  };

  vm.filterList = function (expr) {
    vm.hasFilter = expr !== "true";

    var expression = $parse(expr);
    vm.filter = function (value) {
      return expression(value);
    };
    vm.update();
  };

  vm.searchList = function (reset) {
    if (reset) {
      vm.search = "";
    }
    vm.update();
  };

  vm.refresh = function () {
    loadWishes();
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

  function parseSentenceForNumber(sentence) {
    var matches = sentence
      .replace(/,/g, "")
      .match(/(\+|-)?((\d+(\.\d+)?)|(\.\d+))/);
    return (matches && matches[0]) || null;
  }

  vm.filterChild = function (filterChild) {
    if (filterChild.type == "price") {
      vm.filterPrice(filterChild.min, filterChild.max);
    } else {
      vm.filterList(filterChild.expression);
    }
  };

  vm.filterPrice = function (min, max) {
    vm.filter = function (value) {
      var price = value.price;
      if (!price) return false;

      var matches = price
        .replace(",", ".")
        .replace(" ", "")
        .match(/(\d+\.?\d+|\.\d+)/g);

      if (!matches) return false;

      return matches.some(function (value) {
        if (typeof value == "string") value = parseFloat(value);
        if (value >= min && value <= max) {
          return true;
        } else if (max == null && value >= min) {
          return true;
        }
        return false;
      });

      return false;
    };

    vm.update();
  };

  vm.deleteWish = function (wish) {
    var index = vm.wishes.indexOf(wish);
    if (index > -1) vm.wishes.splice(index, 1);
    vm.update();
  };

  vm.reloadWishList = function () {
    vm.wishList = loadWishList(vm.name);
    loadWishes();
  };

  function gotoForm() {
    // call $anchorScroll()
    $anchorScroll("formEdit");
  }

  function gotoWish(id) {
    // set the location.hash to the id of
    // the element you wish to scroll to.
    $location.hash("envie" + id);

    // call $anchorScroll()
    $anchorScroll();
  }

  function resetForm() {
    vm.newWish = {};
  }

  function loadUser(email) {
    var foundUser = { email: email, name: "" };
    angular.forEach(vm.wishList.users, function (user) {
      if (user.email == email) {
        foundUser.name = user.name;
      }
    });
    return foundUser;
  }

  vm.userName = function (email) {
    return loadUser(email).name;
  };

  vm.renameWishList = function (oldName, newName) {
    vm.renameWishListExist = false;
    vm.doingRenameWishList = true;
    wishListService
      .rename({ name: oldName, new: newName }, {})
      .$promise.then(function () {
        $("#change-url").modal("hide");
        hideModal();
        $location.url("/" + newName);
      })
      .catch(function (reason) {
        console.log(reason);
        vm.renameWishListExist = true;
        vm.doingRenameWishList = false;
      });
  };

  function loadWishList(name) {
    return wishListService.get({ name: name }).$promise.then(function (value) {
      if (value.date) {
        value.date = new Date(value.date);
      }
      // updateDate();
      vm.wishList = value;
      return value;
    });
  }

  var updateWishUser = function (item) {
    if (item.owner) {
      item.ownerUser = (item.owner || loadUser(item.owner.email)).name;
    }
    if (item.userTake && item.userTake.length > 0) {
      var userTakeNames = [];
      angular.forEach(
        item.userTake,
        function (user) {
          this.push((user || loadUser(user)).name);
        },
        userTakeNames
      );
      item.userTakeUsers = userTakeNames.join(", ");
    } else {
      //delete item.userTake;
      delete item.userTakeUsers;
    }
  };

  function loadWishes() {
    var firstLoad = false;
    if (!vm.wishes) {
      vm.wishes = [];
      firstLoad = true;
    }
    var newWishes = wishService.query({ name: $routeParams.name });
    newWishes.$promise.then(function (list) {
      vm.loading = false;
      vm.refreshingLayoutAuto(100, 800);
      angular.forEach(list, function (item) {
        // add to vm.wishes
        var foundwish = $filter("filter")(vm.wishes, { id: item.id });
        updateWishUser(item);

        if (foundwish.length) {
          vm.updatePropertiesWish(foundwish[0], item);
        } else {
          vm.wishes.push(item);
        }
      });

      vm.sortList(
        vm.orderProperties.find(function (value) {
          return value.selected;
        })
      );

      //vm.update();
      //vm.clearRefreshingLayoutAuto();
      if (firstLoad) vm.update();

      $.material.init();
    });
  }

  $scope.$on("$viewContentLoaded", function () {
    $.material.init();

    vm.refreshLayout(10000);

    $('[data-toggle="tooltip"]').tooltip();
  });

  //Bug in modal
  function hideModal() {
    $("body").removeClass("modal-open");
    $(".modal-backdrop").remove();
  }
  hideModal();
}
