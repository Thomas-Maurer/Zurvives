zurvives.controller('ProfilCtrl', function($scope, $auth, $location) {
    $auth.validateUser()
        .then(function(resp){
            $scope.logout = true;
            $scope.currentUser = resp;
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