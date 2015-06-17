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
                $scope.errors = resp.data.errors.full_messages[0];
            });
    };

//Login
    $scope.handleLoginBtnClick = function() {
        //socket.emit('zurvive', {'survive': 'survive'})
        $auth.submitLogin($scope.loginForm)
            .then(function(resp) {
                // handle success response
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


    //socket.on('broadcastZurive', function(result){
     //   console.log(result);
    //});
});