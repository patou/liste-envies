angular
    .module('service')
    .service('wishListService', wishListService);
wishListService.$inject = ['$resource', '$q'];
function wishListService($resource, $q) {
    var base_url = '/api/list/';

    return $resource(base_url + ':name', {name: '@name'},
        {all: {method:'GET', url: base_url + 'all'},
            of: {method:'GET', url: base_url + 'of/:email'},
            join: {method:'GET', url: base_url + ':name/join'},
            rename: {method:'PUT', url: base_url + ':name/:new'}
        });
}
