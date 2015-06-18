var Base = require('./../Class/Base');

var Room = Class.extend({
    playerLimit: 5,
    playerList: [],

    /**
     * Init function
     * @param id
     * @param name
     * @param owner
     * @param maxPlayer
     */
    init: function (id, name, owner, maxPlayer) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.maxPlayer = maxPlayer;
    },
    addPlayer: function(player) {

    },
    removePlayer: function(id) {

    },
    getPlayer: function(id) {

    }
});
module.exports = Room;