zurvives.directive('flash', function(socket) {
    var directive = {
        link: link,
        scope: true,
        restrict: 'AEC'
    };
    return directive;

    function link($scope, element, attrs) {
        socket.on('flash:message', function(data){
            alert('here')
        })
    }
});