var games = require('./games');
var singleGame = require('./singleGame');
var flash = require('./flash');
var player = require('./player');
listGames = [];

module.exports = function(io) {
    io.sockets.on('connection', function(socket){
        //player.initPlayer(io,socket);
        games.initGame(io,socket);
        singleGame.initGame(io,socket);
        flash.initFlash(io,socket);
    });

};
