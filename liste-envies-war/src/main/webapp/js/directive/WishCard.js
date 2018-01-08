/**
 * @ngdoc directive
 * @name list-envie:WishCard
 *
 * @description
 *
 *
 * @restrict E
 * */

var WishCard = function ($scope, wishService, $location, UtilitiesServices) {
    var w = this;

    w.add = false;
    w.edit = false;
    w.remove = false;

    var resetAddForm = function () {
        if (w.wish.external) {
            delete w.wish.external;
        } else {
            w.wish = {
                label: null,
                description: null,
                picture: null,
                urls: null,
                price: null,
                rating: 0
            };
        }


        if (!w.link) {w.link = {};}
        w.link.url = null;
        w.link.name = null;
        w.picture = undefined;

        if (!w.ownerList) {w.wish.suggest = true;}
        w.edit = true;
        w.add = true;
    };
    if (!w.wish.id) {
        resetAddForm();
    }

    $scope.$watch('ownerList', function () {
        if (!w.ownerList && w.add) {
            if (w.wish) w.wish.suggest = true;
            else w.wish = {suggest: true};
        }
    });



    w.link = undefined;
    w.picture = undefined;

    w.editorOptions = {
        disableDragAndDrop: true,
        disableResizeEditor: true,
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

    var lastWish;
    w.editWish = function () {
        lastWish = angular.extend({}, w.wish);
        w.edit = true;
        w.parentController.stampElement(w.wish.id);
    };

    w.cancelWish = function () {
        if (w.add) {
            resetAddForm();
        } else if (w.edit) {
            w.wish = lastWish;
            w.edit = false;
            if (w.link) {
                w.link.url = null;
                w.link.name = null;
            }
            w.parentController.unStampElement(w.wish.id);
        }
    };

    w.updateWish = function () {
        //w.parentController.addWish(w.wish);
        if (w.link) {
            w.addLink(w.link);
        }
        if (w.picture) {
            w.addPicture(w.picture);
        }
        w.edit = false;
        wishService.save({name:w.listName}, w.wish, function(updatedData) {
            if (w.add) {
                w.parentController.addWish(updatedData);
                resetAddForm();
            } else {
                w.edit = false;
                w.parentController.updatePropertiesWish(w.wish, updatedData);
                lastWish = null;
                w.parentController.unStampElement(w.wish.id);
            }

        });
    };

    w.addLink = function(link) {
        if (!link.url)
            return;
        if (!w.wish.urls) {
            w.wish.urls = [];
        }
        w.wish.urls.push(link);
        w.link = undefined;
        w.parentController.stampElement(w.wish.id);
    };

    w.removeLink = function(link) {
        var index = w.wish.urls.indexOf(link);
        if (index >= 0) {
            w.wish.urls.splice(index, 1);
        }
    };

    w.addPicture = function(picture) {
        if (!w.wish.pictures) {
            w.wish.pictures = [];
        }
        w.wish.pictures.push(picture);
        w.picture = undefined;
        w.parentController.stampElement(w.wish.id);
    };

    w.removePicture = function(picture) {
        var index = w.wish.pictures.indexOf(picture);
        if (index >= 0) {
            w.wish.pictures.splice(index, 1);
        }
    };

    w.openComment = function() {

        var commentId = $("#comment-"+w.wish.id);

        w.parentController.stampElement(w.wish.id, true);
        w.parentController.refreshingLayoutAuto(30);

        commentId.collapse('toggle').promise().done(function () {
            w.parentController.unStampElement(w.wish.id, true);
            w.parentController.clearRefreshingLayoutAuto();
        });


    };

    w.addComment = function (wish, commenttext) {
        var comment = {text: commenttext.text};
        w.parentController.stampElement(w.wish.id, false);
        wishService.addComment({name:w.listName, id: wish.id}, commenttext, function(data) {
            w.parentController.refreshingLayoutAuto(30, 200);
            w.parentController.updatePropertiesWish(wish, data);
            w.parentController.unStampElement(w.wish.id, false);
            w.comment.text = '';
        });
    };

    w.rateFunction = function(rating){
        if (!w.edit) {
            setTimeout(function (w) {
                w.updateWish();
            }, 100, w);
        }
    };


    w.given = function(id) {
        if (!w.wish.userTake) {
            w.wish.userTake = [];
        }
        if (!w.user) {
            w.wish.userTake = null;
            //TODO
            alert('Connectez-vous pour pouvoir participer à cette liste');
        }
        else if (!w.wish.userTake.find(function(user){ return user.email == this; }, w.user.email)) {
            wishService.give({name:w.listName, id:id}, {}, function(updatedData) {
                updatedData.userGiven = true; // todo correct into server. 
                w.parentController.updatePropertiesWish(w.wish, updatedData);
                w.parentController.update();
            });
        } else {
            w.wish.userTake = null;
        }
    };


    w.cancel = function(id) {
        wishService.cancel({name:w.listName, id:id}, {}, function(updatedData) {
            updatedData.given = false; // todo correct into server.
            w.parentController.updatePropertiesWish(w.wish, updatedData);
            w.parentController.update();
        });
    };

    w.deleteWish = function() {
        w.remove = true;

        w.parentController.update();
    };

    w.receivedWish = function() {
        w.archive = true;
        w.remove = false;

        w.parentController.update();
    };

    w.cancelRemove = function() {
        w.remove = false;

        w.parentController.update();
    };

    w.doRemove = function() {
        wishService.delete({name:w.listName, id: w.wish.id}, function() {
            w.onDelete({wish: w.wish});
            w.remove = false;

            w.parentController.update();
        });
    };

    w.cancelArchive = function() {
        w.archive = false;


        w.parentController.update();
    };

    w.copyWish = function() {
        var wishCopy = angular.copy(w.wish);
        delete wishCopy.id;
        wishCopy.usertake = [];
        wishCopy.ownerUser = w.owner;

        var absUrl = $location.absUrl();
        var url = $location.url();

        function centeredPopupPosition(w, h) {var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left; var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top; var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width; var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height; var left = ((width / 2) - (w / 2)) + dualScreenLeft; var top = ((height / 2) - (h / 2)) + dualScreenTop; return [left, top]; } var width = 500, height = 700, position = centeredPopupPosition(width, height);

        var popCopy = window.open(absUrl.replace(url, "/addWish"), "Copier", 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=' + width + ',height=' + height + ',top=' + position[1] + ',left=' + position[0]);

        popCopy.wish = wishCopy;
        popCopy.focus();
    };


    w.doArchive = function() {
        wishService.archive({name:w.listName, id: w.wish.id}, function() {
            w.onDelete({wish: w.wish});
            w.archive = false;

            w.parentController.update();
        });
    };
};

angular.module('ListeEnviesDirectives')
    .directive('wishCard', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/directive/WishCard.html',
            bindToController: true,
            controllerAs: 'w',
            controller: ['$scope', 'wishService', '$location', 'UtilitiesServices', WishCard],
            scope: {
                'wish': '=',
                'ownerList': '=',
                'user': '=',
                'parentController': '=',
                'listName': '=',
                'canEdit': '=',
                'onDelete': '&'
            }
        };
});

