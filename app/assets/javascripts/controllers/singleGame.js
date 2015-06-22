zurvives.controller('singleGameController', function ($scope, $location, $state, $http, $stateParams, socket) {
    $scope.slug = $stateParams.slug;
    $scope.players = [];
    $scope.listplayer = [];
    $scope.actions = 3;
    $scope.alreadyMove = false;

    socket.emit('game:get', $scope.slug);
    socket.on('game:get:return', function (data) {
        if (data == undefined) {
            $location.path('/games');
            socket.emit('game:not_found');
        } else if(data.playerList.length >= data.maxPlayer){
            $location.path('/games');
            socket.emit('game:full');
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
        console.log("user has leaves : " + user);
        socket.emit('game:players:get',$scope.slug);
    });

    socket.on('player:join', function (user) {
        //
        if (typeof ($scope.initPlayer) === 'function' && user !== null) {
            console.log("user has join : " + user);
            if ( _.where($scope.listplayer, user.email) ){
                $scope.initPlayer($scope.color, user.email);
            }
        }

    });

    socket.on('game:owner:leave', function () {
        $location.path('/games');
    });

    socket.on('game:changeturn', function (nextplayer) {
        $scope.currentGame.turnof = nextplayer;
        $scope.actions = 3;
        $scope.alreadyMove = false;
    });

    $scope.$on('$stateChangeStart', function() {
        socket.emit('game:leave', {slug: $scope.slug, user: $scope.user});
        socket.removeAllListeners();
    });

    $scope.checkIfPlayerTurn = function () {
        console.log($scope.currentGame.turnof);
        return $scope.currentGame.turnof === $scope.user.email;
    };

    $scope.canPerformAction = function () {
        return $scope.actions > 0;
    };

    $scope.endTurn = function () {
        $scope.actions = 0;
        var indexOfCurrentPlayer =_.findIndex($scope.players, _.findWhere($scope.players, {email: $scope.user.email}));
        var data = {currentplayer: indexOfCurrentPlayer, slug: $scope.slug, actionsLeft: $scope.actions};
        socket.emit('game:player:endturn',data);
        console.log(indexOfCurrentPlayer);
    };

    /* == Movements = */

    socket.on('game:player:move', function (data) {
        console.log("User moove to ...");
        if (typeof ($scope.moveToBroadcast) === 'function') {
            var playerOnMotion =_.where($scope.listplayer, data.player.name)[0];
            $scope.moveToBroadcast(playerOnMotion, data.player.x, data.player.y);
        }


    });

    /* == drag map == */
    // jQuery("#map").dragScroll({});
});