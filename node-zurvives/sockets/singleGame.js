var Game = require('./../models/Game');
var Player = require('./../models/Player');
var _ = require('underscore');

exports.initGame = function(io, socket) {
    socket.on('game:join',joinGame);
    socket.on('game:leave',leaveGame);
    socket.on('deconnection',leaveGame);
    socket.on('game:get',getGame);
    socket.on('game:get:players',getGamePlayers);
    socket.on('stage:move',getGame);

    function joinGame(data) {
        var currentSocketGame = io.sockets.in(data.slug);
        var currentBroadcastGame = socket.broadcast.to(data.slug);
        var currentGame = getCurrentGame(data.slug);
        var player = new Player(socket.id,data.user.email);

        // On player Join
        socket.join(data.slug);
        currentGame.addPlayer(player);
        var players = currentGame.getPlayerList();

        // Emit to everybody the new players list
        currentBroadcastGame.emit('player:join',players);

        // Emit to him the players list
        socket.emit('game:return:players',players);
    }

    function leaveGame(data) {
        var currentGame = getCurrentGame(data.slug);
        var newPlayerList = currentGame.removePlayer({id: socket.id, email: data.user.email});

        // leave room and warn others people : return new players list
        socket.leave(data.slug);

        // If owner leaves, delete rooms and kick players
        if (currentGame.owner == socket.id) {
            deleteGame(currentGame);
            socket.broadcast.to(data.slug).emit('game:owner:leave');
        } else {
            socket.broadcast.to(data.slug).emit('game:return:players',newPlayerList);
            socket.broadcast.to(data.slug).emit('player:leave','mabite');

        }
    }

    /* == Getters and setters == */

    function getGame(slug) {
        var currentGame = getCurrentGame(slug);
        socket.emit('game:return',currentGame);
    }
    function getGamePlayers() {
        var currentGame = getCurrentGame(data.slug);
        var players = currentGame.getPlayerList();
        socket.emit('game:return:players', {players:players});
    }

    function getCurrentGame(slug) {
        return _.where(listGames,{name:slug})[0];
    }

    function getCurrentPlayer(user,game) {
        return _.where(game.playerList,{email:user.email});
    }

    function movePlayer(data) {

    }

    function deleteGame(game) {
        listGames = _.without(listGames, _.findWhere(listGames, game));
    }
};
