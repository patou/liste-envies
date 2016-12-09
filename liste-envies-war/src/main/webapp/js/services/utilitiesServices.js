angular
	.module('service')
    .service('UtilitiesServices', UtilitiesServices);

UtilitiesServices.$inject = ['listEnviesService', '$q'];
    function UtilitiesServices(listEnviesService, $q){
        var obj = {};
        var promise = false;
        var list = false;
        obj.getList = function() {
            if (promise) return promise.promise;
            else if (list) return $q.resolve(list);
            else {
                promise = $q.defer();
                listEnviesService.query().$promise.then(function (data) {
                    list = data;
                    promise.resolve(list);
                    promise = false;
                });

                return promise.promise;
            }
        };

        
        return obj;    
    }