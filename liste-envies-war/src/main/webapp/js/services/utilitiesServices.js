angular
	.module('service')
    .service('UtilitiesServices', UtilitiesServices);

UtilitiesServices.$inject = ['listEnviesService', '$q', '$http'];
    function UtilitiesServices(listEnviesService, $q, $http){
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

        obj.findInfoFromurl = function (url) {
            var req = {
                method: 'GET',
                url: 'https://mercury.postlight.com/parser?url='+url,
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': '0LYlvHDUtTj7ZNzPOm8FGKBmLEhTuASqNj1zwdxI'
                }
            };
            return $http(req).then(function(data){
                return data.data;
            }, function(error){
                return error;
            });
        };


        return obj;    
    }