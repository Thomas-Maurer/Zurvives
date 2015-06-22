zurvives.controller('singleGameController', function ($scope, $location, $state, $http, $stateParams, socket) {
    $scope.slug = $stateParams.slug;
    $scope.players = [];
    $scope.listplayer = [];

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
        console.log("user has leaves : " + user);
        socket.emit('game:players:get',$scope.slug);
    });

    socket.on('player:join', function (user) {
        //
        console.log("user has join : " + user);
        if (typeof ($scope.initPlayer) === 'function' && user !== null) {
            if ( _.where($scope.listplayer, user.email) ){
                $scope.initPlayer($scope.color, user.email);
            }
        }

    });

    socket.on('game:owner:leave', function () {
        $location.path('/games');
    });

    $scope.$on('$stateChangeStart', function() {
        socket.emit('game:leave', {slug: $scope.slug, user: $scope.user});
        socket.removeAllListeners();
    });

    /* == Movements = */

    socket.on('game:player:move', function (data) {
        console.log("User moove to ...");
        if (typeof ($scope.moveToBroadcast) === 'function') {
            //debugger;
            var playerOnMotion =_.where($scope.listplayer, data.player.name)[0];
            $scope.moveToBroadcast(playerOnMotion, data.player.x, data.player.y);
        }

    });

    /* == drag map == */
    // jQuery("#map").dragScroll({});
});