/**
 * Created by Wellan on 30/05/2015.
 */

zurvives.controller('AuthCtrl', function($scope, $auth, $location) {
    $auth.validateUser()
        .then(function(resp){
            $location.path('/profil');
        });

//Registration
    $scope.handleRegBtnClick = function() {
        $auth.submitRegistration($scope.registrationForm)
            .then(function(resp) {
                // handle success response
                $location.path("/login");
            })
            .catch(function(resp) {
                // handle error response
            });
    };

//Login
    $scope.handleLoginBtnClick = function() {
        $auth.submitLogin($scope.loginForm)
            .then(function(resp) {
                // handle success response
                $scope.logout = true;
                $location.path('/profil');
            })
            .catch(function(resp) {
                // handle error response
            });
    };

//Logout
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