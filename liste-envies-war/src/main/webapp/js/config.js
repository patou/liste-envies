app.run(function(amMoment) {
    amMoment.changeLocale('fr');
});
app.config(['$compileProvider', function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|javascript):/);
}]);
