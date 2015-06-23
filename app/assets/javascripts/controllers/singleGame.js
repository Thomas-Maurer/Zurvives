zurvives.controller('singleGameController', function ($scope, $location, $state, $http, $stateParams, socket, characterService, equipmentService,flashService) {

    $scope.slug = $stateParams.slug;
    $scope.players = [];
    $scope.listplayer = [];
    $scope.actions = 3;
    $scope.alreadyMove = false;
    $scope.alreadyLoot = false;
    $scope.characterService = characterService;

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
        flashService.emit("Un joueur à quitté la partie.")

        if (typeof ($scope.deletePlayer) === 'function') {
            console.log("user has leaves : " + user);
            $scope.deletePlayer(user);
            socket.emit('game:players:get', $scope.slug);
        }
    });

    socket.on('player:join', function (user) {
        if (typeof ($scope.initPlayer) === 'function' && user !== null) {
            console.log("user has join : " + user);
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
        $scope.actions = 3;
        $scope.alreadyMove = false;
        $scope.alreadyLoot = false;
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

    socket.on('game:player:loot', function (data) {
        var charToUpdate = _.findWhere($scope.currentGame.listChar, data.user);
        charToUpdate.equipments.push(data.loot);
        console.log('Char ' + charToUpdate.name + ' has looted '+ data.loot.name);

    });

    /* == Movements = */

    socket.on('game:player:move', function (data) {
        console.log("User moove to ...");
        if (typeof ($scope.moveToBroadcast) === 'function') {
            var playerOnMotion =_.where($scope.listplayer, data.player.name)[0];
            $scope.moveToBroadcast(playerOnMotion, data.player.x, data.player.y);
        }


    });

    /* == Loot = */

    $scope.lootIfYouCan = function (ZoneWhereYouWantToLoot, playerZone) {
        if (!$scope.alreadyLoot) {
            if (ZoneWhereYouWantToLoot === playerZone){
                //TODO Call api angular to get a random item
                $http.get('/api/equipment/random_equip').
                    success(function(data, status, headers, config) {
                        var currentChar = _.findWhere($scope.currentGame.listChar, $scope.user.email);
                        currentChar.equipments.push(data.equipments);
                        $scope.alreadyLoot = true;
                        $scope.actions--;

                        equipmentService.create(data.equipments.id, currentChar.id);

                        socket.emit('player:loot:addinvotory', {user: $scope.user.email, loot: data.equipments, slug: $scope.slug} );
                    }).
                    error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            }else {
                console.log("You are to far to loot Bitch");
            }
        }else {
            console.log('You have already loot dont be so greedy !');

        }
    };

    /* == drag map == */
    // jQuery("#map").dragScroll({});
});