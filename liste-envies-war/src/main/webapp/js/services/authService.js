angular
	.module('service', [])
    .service('AuthService', AuthService);

AuthService.$inject = ['$http', '$q'];
    function AuthService($http, $q){
        var obj = {
        	user: null
        };
        
        obj.refresh = function() {
            return new Promise(function(resolve, error) {
                $http.get('/api/user')
                    .success(function (data) {
                        obj.user = eval(data);
                        resolve(obj.user);
                    })
                    .error(function (err) {
                        obj.user = null;
                        error(err);
                    });
            });
    	};
        
        obj.isAuthenticated = function() {
        	return obj.user != null;
        };

        obj.isAdmin = function() {
            return obj.user != null ? obj.user.isAdmin : false;
        };
        
        obj.getUser = function() {
        	return obj.user;
        };
        
        return obj;    
    }