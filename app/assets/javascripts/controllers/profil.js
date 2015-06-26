zurvives.controller('ProfilCtrl', function($scope, $auth, $location,$sce, characterService, skillService) {
    $scope.logout = true;
    $scope.characterService = characterService;
    $scope.skillService = skillService;
    $scope.characterService.all().then(function(data){
        $scope.characterService.lists = data.characters;
    });

    $scope.skillService.all().then(function(data){
        $scope.skillService.lists = data.skills;
    });
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
});
