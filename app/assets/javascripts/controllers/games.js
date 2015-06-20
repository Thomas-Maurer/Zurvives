zurvives.controller('GamesController', function ($scope, $auth, $location, $http, socket) {
    socket.removeAllListeners();
    $scope.gameName = "";
    $scope.players = [];
    $scope.listGame = [];

    $scope.createGame = function () {
        if ($scope.gameName.length > 3) {
            var maxPlayer = $('select').val();
            socket.emit('games:create', {name: $scope.gameName, maxPlayer: maxPlayer});
        } else {
            $scope.error = "Le nom de la partie doit avoir plus de 3 lettres";
        }
    };

    socket.emit('games:get');

    socket.on('game:exist', gameExist);
    socket.on('listGame:refresh', refreshListGame);
    socket.on('listGame:redirect', redirectToGame);
    socket.on('game:full', gameFull);
    socket.on('game:not-found', gameNotFound);

    function refreshListGame(data) {
        for (var i in data) {
            data[i].playerListCount = data[i].playerList.length;
        }
        $scope.listGame = data;
    }

    function redirectToGame(game) {
        $location.path('/game/' + game.slug);
    }

    function gameExist() {
        console.log("Game exists already");
    }

    function gameFull() {
        console.log("Game is full");
    }

    function gameNotFound() {
        console.log("Game not found");
    }
});