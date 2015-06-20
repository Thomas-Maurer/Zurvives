zurvives.controller('ProfilCtrl', function($scope, $auth, $location, characterService,$sce) {
    characterService.all();
    $scope.character = {};
    $scope.logout = true;
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

    var userHtml = "";
    for (var prop in $scope.user) {
        userHtml += "<span>" + prop + ": " + $scope.user[prop] + "</span>";
    }
    $scope.userHTML = $sce.trustAsHtml(userHtml);
    console.log($scope.user);
});
