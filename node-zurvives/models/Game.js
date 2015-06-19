var Base = require('./../Class/Base');
var _ = require('underscore');

var Game = Class.extend({
    playerLimit: 5,
    playerList: [],

    /**
     * Init function
     * @param id
     * @param name
     * @param owner
     * @param maxPlayer
     */
    init: function (name, owner, maxPlayer) {
        this.name = name;
        this.owner = owner;
        this.maxPlayer = maxPlayer;
    },
    addPlayer: function(player) {
        this.playerList.push(player);
    },
    getPlayerList: function(){
       return this.playerList;
    },
    removePlayer: function(player) {
        this.playerList = _.without(this.playerList, _.findWhere(this.playerList, {id: player.id}));
        return this.playerList;
    }
});
module.exports = Game;