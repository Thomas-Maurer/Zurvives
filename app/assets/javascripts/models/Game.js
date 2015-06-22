var Game = Class.extend({

    init: function(players){
        players = typeof players !== 'undefined' ? players : [];
        this.players = players;
        this.nbPlayer = this.players.length;
    },

    start: function() {
    },

    randomTurn: function() {

        _.sample(this.players);
    }
});

//var test = new Game();
//test.randomTurn();
