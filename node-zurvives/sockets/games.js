var Game = require('./../models/Game');
var _ = require('underscore');

exports.initGame = function (io, socket) {

    socket.on('games:create', createGame);
    socket.on('games:get', getGames);

    /* == Function de retour de socket == */
    function createGame(data) {
        var name = data.name;
        var owner = socket.id;
        var maxPlayer = data.maxPlayer;
        if (isGameExist(name).length > 0) {
            socket.emit('game:exist');
        } else {
            var game = new Game(name, owner, maxPlayer);
            listGames.push(game);
            socket.emit('listGame:redirect', game);
            socket.broadcast.emit('listGame:refresh', listGames);
        }
    }

    function getGames() {
        socket.emit('listGame:refresh', listGames);
    }

    function isGameExist(name) {

        return _.where(listGames, {name: name});
    }

};