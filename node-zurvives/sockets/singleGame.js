var Game = require('./../models/Game');
var Player = require('./../models/Player');
var _ = require('underscore');

exports.initGame = function (io, socket) {
    socket.on('game:join', joinGame);
    socket.on('game:leave', leaveGame);
    socket.on('game:players:get', getPlayersList);
    socket.on('deconnection', leaveGame);
    socket.on('game:get', getGame);

    function joinGame(data) {
        socket.join(data.slug ,function(){
            var broadcast = socket.broadcast.to(data.slug);
            var currentGame = getCurrentGame(data.slug);
            var player = new Player(socket.id, data.user.email);
            currentGame.addPlayer(player);

            // Emit
            sendPlayersList(broadcast,currentGame);
            sendPlayersList(socket,currentGame);
            socket.broadcast.emit('listGame:refresh', listGames);
        });
    }

    function leaveGame(data) {
        var currentGame = getCurrentGame(data.slug);

        // if game exists
        if (currentGame != undefined) {

            // if player is in game's players list
            if (currentGame.getPlayerFromList(socket.id) != undefined) {

                var broadcast = socket.broadcast.to(data.slug);

                currentGame.removePlayer({id: socket.id, email: data.user.email});
                socket.leave(data.slug);

                // If owner leaves, delete rooms and kick players
                if (currentGame.owner == socket.id) {
                    broadcast.emit('game:owner:leave');
                } else {
                    broadcast.emit('player:leave',socket.id);
                }

                // If game doesn't have players anymore, delete it
                if (currentGame.getPlayerList().length == 0) {
                    deleteGame(currentGame);
                    socket.broadcast.emit('listGame:refresh', listGames);
                }
            }
        }
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
