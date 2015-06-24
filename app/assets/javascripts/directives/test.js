zurvives.directive('test', function( socket) {
    var directive = {
        link: message,
        scope: true,
        restrict: 'AEC'
    };
    return directive;

    function message($scope, element, attrs) {
        socket.on('init:list2', function (data) {
            alert('hersssse')
        });
    }
});