zurvives.controller('CharactersController', function ($scope, characterService) {
    $scope.characterService = characterService;


    $scope.createCharacter = function(form, character) {
        characterService.create(character).then(function(data){
            characterService.lists.push(data.character);
        });
    }

    $scope.removeCharacter = function(character, index) {
        characterService.remove(character)
        characterService.lists.splice(index, 1);
    }
});