var http = require('http');
httpServer = http.createServer(function(req, res){
});

httpServer.listen(process.env.PORT || 8000)

var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', function(socket){

    socket.on('zurvive', function(data){
        socket.broadcast.emit('broadcastZurive', data)
    });
});