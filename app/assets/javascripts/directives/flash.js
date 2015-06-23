zurvives.directive('flash', function(socket, $rootScope) {
    var directive = {
        link: link,
        scope: true,
        restrict: 'AEC'
    };
    return directive;

    function link($scope, element, attrs) {
        $scope.$on('$destroy', function (event) {
            socket.removeAllListeners();
        });
        socket.on('flash:message', function(data){
            alert(data);
        })
    }
});