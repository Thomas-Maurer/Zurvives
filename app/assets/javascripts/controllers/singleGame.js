zurvives.controller('singleGameController', function ($scope, $location, $state, $http, $stateParams,socket) {
    $scope.slug = $stateParams.slug;
    $scope.players = [];
    console.log($scope.players);
    socket.emit('game:get',$scope.slug);
    socket.emit('game:join', {slug: $scope.slug,user: $scope.user});

    socket.on('game:return', function(data){
        $scope.currentGame = data;
    });

    socket.on('player:join', function(data){
        $scope.players = data;
        console.log("Player join (broadcast)");
    });

    socket.on('game:return:players', function(data){
        $scope.players = data;
        console.log("List refreshed (emit simple)");
    });

    socket.on('player:leave', function(user){
        console.log("user has leaves : "+user);
    });

    socket.on('game:owner:leave', function(){
        console.log('Owner has left');
        $location.path('/games');
    });

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (toState !== fromState) {
            socket.emit('game:leave',{slug: $scope.slug, user: $scope.user});
        }
    });

    /* == Movements = */
});