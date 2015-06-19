zurvives.controller('ProfilCtrl', function($scope, $auth, $location, characterService, skillService) {
    characterService.all();
    $scope.character = {}
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
