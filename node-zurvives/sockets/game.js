var Game = require('./../models/Game');
var _ = require('underscore');

exports.initGame = function(io, socket) {
    socket.on('games:create',initGame);
    socket.on('games:get',getGames);
    socket.on('game:join',joinGame);
    socket.on('game:get',getGame);
    socket.on('stage:move',getGame);

    function initGame(data) {
        var name = data.name;
        var owner = socket.id;
        var maxPlayer = data.maxPlayer;

        var game = new Game(name,owner,maxPlayer);
        listGames.push(game);

        socket.broadcast.emit('listGame:refresh',listGames);
        socket.emit('listGame:redirect',game);
    }

    function getGames() {
        socket.emit('listGame:refresh',listGames);
    }

    function getGame(slug) {
        var currentGame = _.where(listGames,{name:slug});
        socket.emit('game:return',currentGame[0]);
    }

    function joinGame(data) {
        socket.join(data.slug);
        io.sockets.in(data.slug).emit('player:join',{user: data.user});
    }

    function movePlayer(data) {

    }

};