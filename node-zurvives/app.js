var http = require('http');
var fs = require('fs');
var Room = require('./models/Room');
var Player = require('./models/Player');
var Character = require('./models/Character');

fs.readdirSync(__dirname + '/models').forEach(function(file) {
    if (~file.indexOf('.js')) require(__dirname + '/models/' + file);
});

httpServer = http.createServer(function(req, res){
});

httpServer.listen(process.env.PORT || 8000)

var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', function(socket){

    socket.on('zurvive', function(data){
        socket.broadcast.emit('broadcastZurive', data)
    });
});