zurvives.controller('GamesController', function ($scope, $auth, $location, $http, socket, characterService) {
    socket.removeAllListeners();
    $scope.gameName = "";
    $scope.players = [];
    $scope.listGame = [];
    $scope.character = '';
    $scope.characterService = characterService;

    $scope.characterService.all().then(function(data){
        $scope.characterService.lists = data.characters;
    });

    $scope.setCharacter = function(id) {
        $scope.character = _.findWhere(characterService.lists, {id: id});
    };

    $scope.addChar = function (slug) {
        if ($scope.character === '') {
            return
        }else {
            socket.emit('game:add:char', {character: $scope.character, slug: slug});
        }
    };


    $scope.createGame = function () {
        if ($scope.gameName.length > 3) {
            var maxPlayer = $('select').val();
            socket.emit('games:create', {name: $scope.gameName,email: $scope.user.email, maxPlayer: maxPlayer, character: $scope.character});
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