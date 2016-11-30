angular
    .module('service')
    .service('envieService', envieService);
envieService.$inject = ['$resource'];
function envieService($resource) {
    var base_url = '/api/liste/:email/envies/';
    return $resource(base_url + ':id', {id: '@id', email: '@email'},
        {give: {method:'PUT', url: base_url + ':id/give'},
            cancel: {method:'PUT', url: base_url + ':id/cancel'},
            note: {method:'POST', url: base_url + 'note'}
        });
}
