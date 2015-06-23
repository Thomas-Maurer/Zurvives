zurvives.controller('singleGameController', function ($scope, $location, $state, $http, $stateParams, socket, flashService) {
    $scope.slug = $stateParams.slug;
    $scope.players = [];
    $scope.listplayer = [];

    socket.emit('game:get', $scope.slug);
    socket.on('game:get:return', function (data) {
        if (data == undefined) {
            $location.path('/games');
            flashService.emit("La partie n'existe pas");
        } else if(data.playerList.length >= data.maxPlayer){
            $location.path('/games');
            flashService.emit('La partie est pleine')
        } else {
            $scope.currentGame = data;
            socket.emit('game:join', {slug: $scope.slug, user: $scope.user});
        }
    });

    socket.on('map:loaded', function () {
        if (typeof ($scope.initPlayer) === 'function') {
            if ($scope.players.length === 1 ) {
                $scope.initPlayer($scope.color, $scope.user.email);
            }else {
                var lisplayerExcepthim = _.without($scope.players, _.findWhere($scope.players, {email: $scope.user.email}))

                _.each($scope.players, function (player) {
                    $scope.initPlayer($scope.color, player.email);
                });
            }
        }
    });

    socket.on('game:return:players', function (data) {
        $scope.players = data;
    });

    socket.on('player:leave', function (user) {
        socket.emit('game:players:get',$scope.slug);
        flashService.emit("Un jour à quitté la partie.")
    });

    socket.on('player:join', function (user) {
        if (typeof ($scope.initPlayer) === 'function' && user !== null) {
            if ( _.where($scope.listplayer, user.email) ){
                $scope.initPlayer($scope.color, user.email);
            }
        }

    });

    socket.on('game:owner:leave', function () {
        $location.path('/games');
        flashService.emit("Le propriétaire à quitté la partie.")
    });

    socket.on('game:changeturn', function (nextplayer) {
        $scope.currentGame.turnof = nextplayer;
    });

    $scope.$on('$stateChangeStart', function() {
        socket.emit('game:leave', {slug: $scope.slug, user: $scope.user});
        socket.removeAllListeners();
    });

    $scope.checkIfPlayerCanDoAction = function () {
        console.log($scope.currentGame.turnof);
        return $scope.currentGame.turnof === $scope.user.email;
    };
    /* == Movements = */

    socket.on('game:player:move', function (data) {
        console.log("User moove to ...");
        if (typeof ($scope.moveToBroadcast) === 'function') {
            var playerOnMotion =_.where($scope.listplayer, data.player.name)[0];
            $scope.moveToBroadcast(playerOnMotion, data.player.x, data.player.y);
        }


    });

});