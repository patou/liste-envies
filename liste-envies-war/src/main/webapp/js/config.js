app.run(function(amMoment) {
    amMoment.changeLocale('fr');
});
app.config(['$compileProvider', function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|javascript):/);
}]);
app.constant("WishListTypePicture", [
    {
        type: "OTHER",
        picture: "img/default.jpeg",
        credit: "Photo by Markus Spiske on Unsplash"
    },{
        type: "BIRTH",
        picture: "img/baby.jpeg",
        credit: "Photo by insung yoon on Unsplash"
    },{
        type: "BIRTHDAY",
        picture: "img/birthday.jpeg",
        credit: "Photo by Nikhita Singhal on Unsplash"
    },{
        type: "SPECIAL_OCCASION",
        picture: "img/fest.jpeg",
        credit: "Photo by Gaelle Marcel on Unsplash"
    },{
        type: "WEDDING",
        picture: "img/wedding.jpeg",
        credit: "Photo by Zoriana Stakhniv on Unsplash"
    },
]);
