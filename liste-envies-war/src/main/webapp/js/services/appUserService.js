angular
    .module('service')
    .service('appUserService', appUserService);
appUserService.$inject = ['$resource'];
function appUserService($resource) {
    var base_url = '/api/utilisateur/';
    return $resource(base_url + ':email', {email: '@email'},
        {
            notification: {method:'GET', url: base_url + ':email/notifications', isArray:true},
            given: {method:'GET', url: base_url + ':email/given', isArray:true},
            archived: {method:'GET', url: base_url + ':email/archived', isArray:true}
        });
}
