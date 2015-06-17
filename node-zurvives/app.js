var http = require('http');
var Base = require('Class/Base');
var fs = require('fs');
fs.readdirSync(__dirname + '/sockets').forEach(function(file) {
    if (~file.indexOf('.js')) require(__dirname + '/sockets/' + file);
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