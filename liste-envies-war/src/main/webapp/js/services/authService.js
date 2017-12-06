angular
	.module('service', [])
    .service('AuthService', AuthService);

AuthService.$inject = ['$http'];
    function AuthService($http){
        var obj = {
        	user: null
        };
        
        obj.refresh = function() {
	        return $http.get('/user')
		        .success(function(data) {
		            return obj.user = eval(data);
		        })
	        	.error(function(error) {
	        		return obj.user = null;
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