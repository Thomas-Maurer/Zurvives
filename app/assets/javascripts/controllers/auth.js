zurvives.controller('AuthCtrl', function($scope, $auth, $location,authService, characterService) {
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
                $scope.errors = resp.data.errors.full_messages[0];
            });
    };

//Login
    $scope.handleLoginBtnClick = function() {
        $auth.submitLogin($scope.loginForm)
            .then(function(resp) {
                // handle success response
                authService.onLogin();
                $scope.logout = true;
                $location.path('/profil');
            })
            .catch(function(resp) {
                // handle error response
                $scope.errors = resp.data.errors.full_messages[0];
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