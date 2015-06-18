var game = require('./game');
var player = require('./player');
listGames = [];

module.exports = function(io) {
    io.sockets.on('connection', function(socket){
        //player.initPlayer(io,socket);
        game.initGame(io,socket);
    });

};
