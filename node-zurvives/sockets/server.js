var games = require('./games');
var singleGame = require('./singleGame');
var player = require('./player');
listGames = [];

module.exports = function(io) {
    io.sockets.on('connection', function(socket){
        //player.initPlayer(io,socket);
        games.initGame(io,socket);
        singleGame.initGame(io,socket);

        socket.on('flash:message:send',function(data){
            console.log("[FLASH] "+data.message);
            socket.emit('flash:message',data);
        });
    });

};
