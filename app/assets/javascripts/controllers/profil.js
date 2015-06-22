zurvives.controller('ProfilCtrl', function($scope, $auth, $location,$sce, characterService) {
    $scope.logout = true;
    $scope.characterService = characterService;
    $scope.characterService.all().then(function(data){
        $scope.characterService.lists = data.characters;
    })
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
