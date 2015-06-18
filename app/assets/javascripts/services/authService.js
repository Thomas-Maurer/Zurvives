'use strict';

angular
    .module('zurvives')
    .service('authService', authService);

authService.$inject = ['$auth', '$http', '$state']
function authService($auth, $http, $state) {
    var that = this;
    that.user = {};
    var service = {
        isAuth: isAuth
    }

    return service;

    function isAuth() {
        var auth = false;
        $auth.validateUser()
            .then(function(resp){
                $http.get('/api/getuser').
                    success(function(data, status, headers, config) {
                    }).
                    error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            })
            .catch(function (resp){
                return $state.go('login').then(function () {
                    return $state.reload();
                });
            });
    }
}

