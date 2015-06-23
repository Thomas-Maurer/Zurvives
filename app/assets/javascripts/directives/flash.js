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
            $scope.flashMessage = data.message;
            $("#flash-message").fadeIn(300);
            $("#flash-message").delay(1000).fadeOut(300);

        })
    }
});