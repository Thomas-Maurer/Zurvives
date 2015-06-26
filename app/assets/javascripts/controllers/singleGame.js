zurvives.controller('singleGameController', function ($scope, $location, $state, $http, $stateParams, socket, characterService, equipmentService,flashService) {
    $scope.slug = $stateParams.slug;
    $scope.players = [];
    $scope.listplayer = [];
    $scope.listZombies = [];
    $scope.actions = 3;
    $scope.alreadyMove = false;
    $scope.alreadyLoot = false;
    $scope.characterService = characterService;


    $scope.$on('$destroy', function (event) {
        socket.removeAllListeners();
    });

    socket.emit('game:get', $scope.slug);
    socket.on('game:get:return', function (data) {
        if (data == undefined) {
            flashService.emit("La partie n'existe pas");

        } else if(data.playerList.length >= data.maxPlayer){
            $state.go("games").then(function(){
                flashService.emit('La partie est pleine')
            })
        } else {
            $scope.currentGame = data;
            $scope.currentChar = _.find($scope.currentGame.listChar,function (char) {return char.user.email === $scope.user.email});
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
        flashService.emit("Un joueur à quitté la partie.");

        if (typeof ($scope.deletePlayer) === 'function') {
            flashService.emit("user has leaves : " + user);
            $scope.deletePlayer(user);
            socket.emit('game:players:get', $scope.slug);
        }
    });

    socket.on('player:join', function (user) {
        if (typeof ($scope.initPlayer) === 'function' && user !== null) {
            flashService.emit("user has join : " + user);
            if ( _.where($scope.listplayer, user.email) ){
                $scope.initPlayer($scope.color, user.email);
            }
        }

    });

    socket.on('game:owner:leave', function () {
        $state.go("games").then(function(){
            flashService.emit("Le propriétaire à quitté la partie.")
        })
    });

    socket.on('game:changeturn', function (nextplayer) {
        console.log(nextplayer);
        if ($scope.actions === 0 || $scope.user.email === nextplayer) {
            $scope.currentGame.turnof = nextplayer;
            $scope.actions = 3;
            $scope.alreadyMove = false;
            $scope.alreadyLoot = false;
            //flashService.broadcast("Turn of "+ nextplayer);
            flashService.emit("Turn of "+ nextplayer);
        }
    });

    socket.on('reload:game', function (data){
        $scope.currentGame = data;
    });

    $scope.$on('$stateChangeStart', function() {
        socket.emit('game:leave', {slug: $scope.slug, user: $scope.user});
        socket.removeAllListeners();
    });

    $scope.checkIfPlayerTurn = function () {
        return $scope.currentGame.turnof === $scope.user.email;
    };

    $scope.canPerformAction = function () {
        return $scope.actions > 0;
    };

    $scope.endTurn = function () {
        $scope.actions = 0;
        var indexOfCurrentPlayer =_.findIndex($scope.players, _.findWhere($scope.players, {email: $scope.user.email}));
        var data = {currentplayer: indexOfCurrentPlayer, slug: $scope.slug, actionsLeft: $scope.actions};
        socket.emit('game:player:endturn', data);
    };

    socket.on('game:zombieturn', function () {
        if (typeof ($scope.getSpawnZombies) === 'function' ){

            if ($scope.currentGame.listZombies.length > 0 ) {
                var loudestZone = _.max($scope.getZones(), function(zone){
                    return zone.noise;
                });
                _.each($scope.currentGame.listZombies, function (zombie) {
                    var pathZ = $scope.findPath(zombie.zone.toString(),loudestZone.zone.toString());
                    _.each($scope.getZones(), function(zone) {
                        zone.parent = null;
                    });
                    var zombieInMotion =_.where($scope.listZombies,{id: zombie.id})[0];
                    $scope.moveToZ(zombieInMotion, pathZ[1].x, pathZ[1].y, pathZ[1].zone);
                    socket.emit('game:zombie:move',{id: zombie.id, zone: pathZ[1].zone, slug: $scope.slug});
                });
            }
            console.log('zombie turn');
            _.each($scope.getSpawnZombies(), function (zone) {
                $scope.initZombie(zone, $scope.listZombies.length);
            });
            socket.emit('game:zombies:loaded', {slug: $scope.slug});
        }
    });
    socket.on('game:player:loot', function (data) {
        var charToUpdate = _.findWhere($scope.currentGame.listChar, data.user);
        equipmentService.create(data.loot.id, charToUpdate.id);
        flashService.emit('Char ' + charToUpdate.name + ' has looted '+ data.loot.name);

    });

    /* == Movements = */

    socket.on('game:player:move', function (data) {
        if (typeof ($scope.moveToBroadcast) === 'function') {
            var playerOnMotion =_.where($scope.listplayer, data.player.name)[0];
            $scope.moveToBroadcast(playerOnMotion, data.player.x, data.player.y);
        }


    });

    /* == Loot = */

    $scope.lootIfYouCan = function (ZoneWhereYouWantToLoot, playerZone) {
        if (!$scope.alreadyLoot) {
            if (ZoneWhereYouWantToLoot === playerZone){
                $http.get('/api/equipment/random_equip').
                    success(function(data, status, headers, config) {
                        $scope.alreadyLoot = true;
                        $scope.actions--;

                        equipmentService.create(data.equipments.id, $scope.currentChar.id);
                        //TODO Reload current char to update in html inventory
                        flashService.broadcast('Char ' + $scope.user.email + ' has looted '+ data.equipments.name);
                        flashService.emit('Char ' + $scope.user.email + ' has looted '+ data.equipments.name);

                        socket.emit('player:loot:addinvotory', {user: $scope.user.email, loot: data.equipments, slug: $scope.slug} );
                    }).
                    error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            }else {
                flashService.emit("You are to far to loot");
            }
        }else {
            flashService.emit('You have already loot dont be so greedy !');

        }
    };

    /* == drag map == */
    // jQuery("#map").dragScroll({});
});