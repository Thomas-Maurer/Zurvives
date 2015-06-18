var Base = require('./../Class/Base');

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
        playerList.push(player);
    },
    getPlayerList: function(){
       return this.playerList;
    },
    removePlayer: function(id) {

    }
});
module.exports = Game;