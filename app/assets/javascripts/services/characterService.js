'use strict';

angular
    .module('zurvives')
    .factory('characterService', characterService);

characterService.$inject = ["AngularData", "$q", "$http"]
function characterService(AngularData, $q, $http) {
    var service = {
        all: all,
        show: show,
        create: create,
        update: update,
        remove: remove,
        resource: "characters",
        lists: []
    }

    return service;

    function all() {
        var that = this;
        AngularData.all(this.resource).then(function(data){
            _.each(data.characters, function(character){
                that.lists.push(new Character(character, that));
            })
            console.log(that);
            return data;
        });
    }

    function show(id) {
        var that = this;
        AngularData.show(this.resource, id).then(function(character){
            that.model = new Character(character);
            return character;
        });
    }
    function create(data) {
        var datas = {};
        datas.characters = data;
        AngularData.create(this.resource, datas);
    }

    function update(data, id) {
        var datas = {};
        datas.characters = data;
        AngularData.update(this.resource, datas, id).then(function(character){
            return character;
        });
    }

    function remove(id) {
        AngularData.remove(this.resource, id).then(function(data){
            console.log(data)
        });
    }
}
