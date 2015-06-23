zurvives.controller('GamesController', function ($scope, $auth, $location, $http, socket) {
    socket.removeAllListeners();
    $scope.gameName = "";
    $scope.players = [];
    $scope.listGame = [];

    $scope.createGame = function () {
        if ($scope.gameName.length > 3) {
            var maxPlayer = $('select').val();
            socket.emit('games:create', {name: $scope.gameName,email: $scope.user.email, maxPlayer: maxPlayer});
        } else {
            socket.emit('flash:message:send',{message: 'Le nom de la partie doit avoir plus de 3 lettres'});
        }
    };

    socket.emit('games:get');
    socket.on('listGame:refresh', refreshListGame);
    socket.on('listGame:redirect', redirectToGame);


    function refreshListGame(data) {
        if (data.length != 0) {
            for (var i in data) {
                data[i].playerListCount = data[i].playerList.length;
            }
            $scope.listGame = data;
            $scope.gameError = "";
        } else {
            $scope.gameError = "Aucunes parties pour le moment";
            $scope.listGame = [];
        }

    }

    function redirectToGame(game) {
        $location.path('/game/' + game.slug);
    }

});