zurvives.directive('flash', function(socket) {
    var flash = {
        link:message,
        scope: true,
        restrict: 'AEC'
    };
    return flash;

    function message($scope,element,attrs) {
        socket.on('flash:message', function(data) {
            console.log('here');
            $scope.flashMessage = data.message;

        });
    }

});