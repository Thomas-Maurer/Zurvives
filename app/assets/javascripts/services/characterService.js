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
        return AngularData.all(this.resource);
    }

    function show(id) {
        var that = this;
        return AngularData.show(this.resource, id);
    }
    function create(data) {
        var datas = {};
        datas.characters = data;
        return AngularData.create(this.resource, datas);
    }

    function update(data, id) {
        var datas = {};
        datas.characters = data;
        return AngularData.update(this.resource, datas, id);
    }

    function remove(id) {
        return AngularData.remove(this.resource, id);
    }
}
