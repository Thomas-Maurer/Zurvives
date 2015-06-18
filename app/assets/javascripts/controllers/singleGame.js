zurvives.controller('singleGameController', function ($scope, $auth, $location, $http, socket,$stateParams) {
    $scope.slug = $stateParams.slug;
    socket.emit('game:get',$scope.slug);

    socket.on('game:return', function(data){
        $scope.currentGame = data;
    });
    socket.emit('game:join', {slug: $scope.slug,user: $scope.user});

    socket.on('player:join', function(user){
        console.log(user);
    });

    /* == Movements = */


});