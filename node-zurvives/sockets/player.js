exports.initPlayer = function(io, socket) {
    socket.on('player:connection',add);

    function add(data) {
        var user = data.user;
    }
};