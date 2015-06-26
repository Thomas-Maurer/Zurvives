var Game = require('./../models/Game');
var Player = require('./../models/Player');
var _ = require('underscore');

exports.initGame = function (io, socket) {
    socket.on('game:join', joinGame);
    socket.on('game:leave', leaveGame);
    socket.on('game:players:get', getPlayersList);
    socket.on('deconnection', leaveGame);
    socket.on('game:get', getGame);
    socket.on('game:stage:player:move', movePlayerOnStage);
    socket.on('map:loaded', mapLoaded);
    socket.on('game:changeTurn', changeTurn);
    socket.on('game:player:endturn', changeTurn);
    socket.on('game:add:char', addcharTogame);
    socket.on('game:add:zombie', addZombieToGame);
    socket.on('game:zombies:loaded', reloadGame);
    socket.on('game:zombie:move', zombieMove);
   // socket.on('game:zombieturn:end', resetTurn);
    socket.on('player:loot:addinvotory', notifyAllLoot);

    function joinGame(data) {
        socket.join(data.slug ,function(){
            var broadcast = socket.broadcast.to(data.slug);
            var currentGame = getCurrentGame(data.slug);

            var isPlayerExist = currentGame.getPlayerFromList(data.user.email);

            if(isPlayerExist == undefined) {
                // Player is not in the game
                var player = new Player(socket.id, data.user.email);
                currentGame.addPlayer(player);
            }

            // Emit
            sendPlayersList(broadcast,currentGame);
            sendPlayersList(socket,currentGame);
            socket.broadcast.emit('player:join', player);
            broadcast.emit('flash:message',{message: 'Un joueur à rejoint la partie'});
            socket.broadcast.emit('listGame:refresh', listGames);

        });
    }
    function zombieMove (data) {
        var currentGame = getCurrentGame(data.slug);
        currentGame.listZombies[_.indexOf(currentGame.listZombies, _.where(currentGame.listZombies, {id: data.id})[0])].zone = data.zone;
    }
    function reloadGame (data) {
        var currentGame = getCurrentGame(data.slug);
        var broadcast = socket.broadcast.to(data.slug);
        broadcast.emit('reload:game',currentGame);
        socket.emit('reload:game',currentGame);
    }

    function leaveGame(data) {
        var currentGame = getCurrentGame(data.slug);

        // if game exists
        if (currentGame != undefined) {

            // if player is in game's players list
            if (currentGame.getPlayerFromList(data.user.email) != undefined) {

                var broadcast = socket.broadcast.to(data.slug);
                currentGame.removePlayer(data.user.email);

                socket.leave(data.slug);
                // If owner leaves, delete rooms and kick players
                if (currentGame.owner === data.user.email) {
                    broadcast.emit('game:owner:leave');
                } else {
                    broadcast.emit('player:leave',data.user.email);
                }
                // If game doesn't have players anymore, delete it
                if (currentGame.getPlayerList().length == 0) {
                    deleteGame(currentGame);
                    socket.broadcast.emit('listGame:refresh', listGames);
                }
            }
        }
    }

    function addcharTogame (data) {
        var currentGame = getCurrentGame(data.slug);
        currentGame.addChar(data.character);
    }

    function addZombieToGame (data) {

        var currentGame = getCurrentGame(data.slug);
        currentGame.addZombie(data.zombie);
    }

    function notifyAllLoot (data) {
        var broadcast = socket.broadcast.to(data.slug);
        broadcast.emit('game:player:loot', data);
    }

    function mapLoaded() {
        socket.emit('map:loaded');
    }

    function changeTurn(data) {
        var currentGame = getCurrentGame(data.slug);
        var broadcast = socket.broadcast.to(data.slug);

        if (typeof (currentGame.getPlayerList) === 'function') {
            if (data.currentplayer + 1 < currentGame.getPlayerList().length ) {
                currentGame.turnOfPlayer(currentGame.getPlayerList()[data.currentplayer + 1].email);
                socket.broadcast.to(data.slug).emit('game:changeturn', currentGame.getPlayerList()[data.currentplayer + 1].email);
                socket.emit('game:changeturn', currentGame.getPlayerList()[data.currentplayer + 1].email);

            } else {
                currentGame.turnOfPlayer(currentGame.getPlayerList()[0].email);
                socket.broadcast.to(data.slug).emit('game:changeturn', currentGame.getPlayerList()[0].email);
                socket.emit('game:changeturn', currentGame.getPlayerList()[0].email);

                socket.broadcast.to(data.slug).emit('game:zombieturn');
                socket.emit('game:zombieturn');
            }
        }
    }

    function movePlayerOnStage (data) {
        var broadcast = socket.broadcast.to(data.slug);
        //Send to all something for update stage
        broadcast.emit('game:player:move', data);
    }
    /* == Getters and setters == */

    function getGame(slug) {
        var currentGame = getCurrentGame(slug);
        socket.emit('game:get:return', currentGame);
    }

    function getPlayersList(slug){
        var currentGame = getCurrentGame(slug);
        var players = currentGame.getPlayerList();
        socket.emit('game:return:players', players);
    }

    function sendPlayersList(to,currentGame) {
        var players = currentGame.getPlayerList();
        to.emit('game:return:players', players);
    }

    function getCurrentGame(slug) {
        return _.where(listGames, {slug: slug})[0];
    }

    function deleteGame(game) {
        listGames = _.without(listGames, _.findWhere(listGames, game));
    }

};
