zurvives.controller('CharactersController', function ($scope, characterService) {
    $scope.characterService = characterService;
    $scope.character = {
        skill_ids: []
    }

    $scope.createCharacter = function(form, character) {
        characterService.create(character).then(function(data){
            characterService.lists.push(data.character);
            $scope.character = {
                skill_ids: []
            }
            $scope.skillSelected = 0;
        });
    }

    $scope.setSkill = function(skill) {
        $scope.character.skill_ids.push(skill);
    }

    $scope.removeCharacter = function(character, index) {
        characterService.remove(character)
        characterService.lists.splice(index, 1);
    }
});