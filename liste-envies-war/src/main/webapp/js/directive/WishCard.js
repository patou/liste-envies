/**
 * @ngdoc directive
 * @name list-envie:WishCard
 *
 * @description
 *
 *
 * @restrict E
 * */

var WishCard = function ($scope, envieService) {
    var w = this;

    w.edit = false;

    w.link = undefined;

    w.editorOptions = {
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

    var lastWish;
    w.editWish = function () {
        lastWish = Object.assign({}, w.wish);
        w.edit = true;
        w.parentController.stampElement(w.wish.id);
    };

    w.cancelWish = function () {
        w.wish = lastWish;
        w.edit = false;
        w.parentController.unStampElement(w.wish.id);
    };

    w.updateWish = function () {
        w.edit = false;
        lastWish = null;
        w.parentController.unStampElement(w.wish.id);
        w.parentController.addEnvie(w.wish)
    };

    w.addLink = function(link) {
        if (!w.wish.urls) {
            w.wish.urls = [];
        }
        w.wish.urls.push(link);
        w.link = undefined;
        w.parentController.stampElement(w.wish.id);
    };

    w.openComment = function() {

        const commentId = $("#comment-"+w.wish.id);

        w.parentController.stampElement(w.wish.id);

        commentId.collapse('toggle').promise().done(function () {
            w.parentController.unStampElement(w.wish.id);
            w.parentController.clearRefreshingLayoutAuto();
        });

        w.parentController.refreshingLayoutAuto(100);
    };

    w.addNote = function (envie, notetext) {
        w.parentController.addNote(w.wish, notetext);
        w.note.text = '';
    };








};

app
    .directive('wishCard', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/directive/WishCard.html',
            bindToController: true,
            controllerAs: 'w',
            controller: ['$scope', 'envieService', WishCard],
            scope: {
                'wish': '=',
                'ownerList': '=',
                'user': '=',
                'parentController': '=',
                'listName': '='
            },
            link: function (scope, elem, attr) {

            }
        };
});

