zurvives.controller('GamesController', function ($scope, $auth, $location, $http, socket) {
    socket.removeAllListeners();
    $scope.gameName = "";
    $scope.players = [];
    $scope.listGame = [];

    $scope.createGame = function () {
        if ($scope.gameName.length > 3) {
            socket.emit('games:create', {name: $scope.gameName, maxPlayer: 3});
        } else {
            $scope.error = "Le nom de la partie doit avoir plus de 3 lettres";
        }
    };

    socket.emit('games:get');

    socket.on('game:exist', gameExist);
    socket.on('listGame:refresh', refreshListGame);
    socket.on('listGame:redirect', redirectToGame);

    function refreshListGame(data) {
        $scope.listGame = data;
    }

    function redirectToGame(game) {
        $location.path('/game/' + game.name);
    }

    function gameExist() {
        console.log("Game exists already");
    }
});