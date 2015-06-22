var Base = require('./../Class/Base');

var Character = Class.extend({
    init: function (id, name,level,skills,inventory,equipment,actionPoints,expBarre) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.skills = skills;
        this.inventory = inventory;
        this.equipment = equipment;
        this.actionPoint = actionPoint;
        this.expBarre = expBarre;
    },
    getLaide: function() {

    },
    updateInventory: function(equipment) {
        this.equipment.push(equipment);
    }
});
module.exports = Character;