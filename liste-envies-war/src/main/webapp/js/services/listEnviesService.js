angular
    .module('service')
    .service('listEnviesService', listEnviesService);
listEnviesService.$inject = ['$resource'];
function listEnviesService($resource) {
    var base_url = '/api/liste/';
    return $resource(base_url + ':name', {name: '@name'},
        {all: {method:'GET', url: base_url + 'all'},
            of: {method:'GET', url: base_url + 'of/:email'}
        });
}
