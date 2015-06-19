var Game = require('./../models/Game');
var _ = require('underscore');

exports.initGame = function(io, socket) {
    socket.on('games:create',initGame);
    socket.on('games:get',getGames);
    /* == Function de retour de socket == */

    function initGame(data) {
        var name = data.name;
        var owner = socket.id;
        var maxPlayer = data.maxPlayer;
         if (isGameExist(name).length > 0) {
             console.log("game exist");
         } else {
             var game = new Game(name,owner,maxPlayer);
             listGames.push(game);
             socket.broadcast.emit('listGame:refresh',listGames);
             socket.emit('listGame:redirect',game);
         }



    }

    function getGames() {
        socket.emit('listGame:refresh',listGames);
    }

    function isGameExist(name) {
        return _.where(listGames,{name:name});
    }

};