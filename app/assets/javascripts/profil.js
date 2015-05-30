zurvives.controller('ProfilCtrl', function($scope, $auth, $location, $http) {

    $auth.validateUser()
        .then(function(resp){
            $scope.logout = true;
            $http.get('/getuser').
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    $scope.currentUser = data.user;
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
    })
        .catch(function (resp){debugger;
            //if not logged redirect to login form
            $location.path("/login");
        });

    //Logout
    $scope.handleSignOutBtnClick = function() {
        $auth.signOut()
            .then(function(resp) {
                // handle success response
                $scope.logout = false;
                $location.path('/login');
            })
            .catch(function(resp) {
                // handle error response
            });
    };
});