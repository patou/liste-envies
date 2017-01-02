
var app = angular.module('ListeEnviesTranslation', ['pascalprecht.translate']);

app.config(['$translateProvider', function ($translateProvider) {
    // add translation table
    $translateProvider.useUrlLoader('js/lang/fr-FR.json');
    $translateProvider.preferredLanguage('fr-FR');
}]);