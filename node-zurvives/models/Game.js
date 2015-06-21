var Base = require('./../Class/Base');
var _ = require('underscore');

var Game = Class.extend({

    /**
     * Init function
     * @param id
     * @param name
     * @param owner
     * @param maxPlayer
     */
    init: function (name, owner, maxPlayer) {
        this.name = name;
        this.slug = name.replace(/ /g,"-");
        this.owner = owner;
        this.maxPlayer = maxPlayer;
        this.playerList = [];
    },
    addPlayer: function(player) {
        this.playerList.push(player);
    },
    getPlayerFromList: function(email) {
        return _.where(this.playerList, {email: email})[0];
    },
    getPlayerList: function(){
       return this.playerList;
    },
    removePlayer: function(player) {
        this.playerList = _.without(this.playerList, _.findWhere(this.playerList, {email: player.email}));
        return this.playerList;
    }
});
module.exports = Game;