zurvives.controller('singleGameController', function ($scope, $location, $state, $http, $stateParams,socket) {
    $scope.slug = $stateParams.slug;
    $scope.players = [];

    socket.emit('game:get', $scope.slug);
    socket.on('game:get:return', function (data) {
        if (data == undefined) {
            $location.path('/games');
            console.log('game:not_found');
        } else {
            $scope.currentGame = data;
            socket.emit('game:join', {slug: $scope.slug, user: $scope.user});
        }
    });

    socket.on('game:return:players', function (data) {
        $scope.players = data;
    });

    socket.on('player:leave', function (user) {
        console.log("user has leaves : " + user);
    });

    socket.on('game:owner:leave', function () {
        $location.path('/games');
    });

    $scope.$on('$stateChangeStart', function () {
        socket.emit('game:leave', {slug: $scope.slug, user: $scope.user});
        socket.removeAllListeners();
    });


    /* == Movements = */
});