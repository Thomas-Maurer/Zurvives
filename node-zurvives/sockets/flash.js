var _ = require('underscore');

exports.initFlash = function (io, socket) {

    socket.on('flash:message:send',function(data){
        socket.emit('flash:message',data);
    });

    socket.on('flash:message:broadcast',function(data){
        socket.emit('flash:message',data);
    });
};