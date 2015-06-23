'use strict';

angular
    .module('zurvives')
    .service('gameService', gameService);

gameService.$inject = ['socket']
function gameService(socket) {
    var that = this;
    var service = {
        addPlayer: addPlayer,
        findPlayer: findPlayer,
        removePlayer: removePlayer,
        players: []
    };

    function addPlayer(player) {
        this.players.push(player);
        socket.on('addGame', refreshListGame);
    }

    function findPlayer(id) {
        return _.findWhere(this.players, {id: id})
    }

    function removePlayer(id) {
        this.players = _.without(this.players, _.findWhere(this.players, {id: id}))
    }

    return service;
}
