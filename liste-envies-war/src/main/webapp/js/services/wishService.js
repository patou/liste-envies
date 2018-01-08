angular
    .module('service')
    .service('wishService', wishService);
wishService.$inject = ['$resource'];
function wishService($resource) {
    var base_url = '/api/wishes/:name/';
    return $resource(base_url + ':id', {id: '@id', name: '@name'},
        {give: {method:'PUT', url: base_url + 'give/:id'},
            cancel: {method:'DELETE', url: base_url + 'give/:id'},
            addComment: {method:'POST', url: base_url + ':id/addComment'},
            delete: {method:'DELETE', url: base_url + ':id'},
            archive: {method:'PUT', url: base_url + 'archive/:id'}
        });
}
