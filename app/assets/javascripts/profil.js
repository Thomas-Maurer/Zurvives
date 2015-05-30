zurvives.controller('ProfilCtrl', function($scope, $auth, $location) {
    $scope.logout = false;


    $scope.handleRegBtnClick = function() {
        $auth.submitRegistration($scope.registrationForm)
            .then(function(resp) {
                // handle success response
                $location.path("/profil");
            })
            .catch(function(resp) {
                // handle error response
            });
    };


    $scope.handleLoginBtnClick = function() {
        $auth.submitLogin($scope.loginForm)
            .then(function(resp) {
                // handle success response
                $scope.logout = true;
            })
            .catch(function(resp) {
                // handle error response
            });
    };

    $scope.handleSignOutBtnClick = function() {
        $auth.signOut()
            .then(function(resp) {
                // handle success response
                $scope.logout = false;
            })
            .catch(function(resp) {
                // handle error response
            });
    };
});
