zurvives.factory('socket', function ($rootScope, socketFactory) {
    /*var socket = io.connect("http://"+window.location.hostname+":8000");
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {  
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        },

        removeAllListeners: function (eventName, callback) {
            socket.removeAllListeners(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        }
    };*/

  var myIoSocket = io.connect("http://"+window.location.hostname+":8000");

  mySocket = socketFactory({
    ioSocket: myIoSocket
  });

  return mySocket;
});