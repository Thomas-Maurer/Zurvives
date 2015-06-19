'use strict';

angular
    .module('zurvives')
    .factory('equipmentService', equipmentService);

equipmentService.$inject = ["AngularData"]
function equipmentService(AngularData) {
    var service = {
        all: all,
        show: show,
        create: create,
        remove: remove,
        resource: "equipments",
        lists: []
    }

    return service;

    function all() {
        var that = this;
        AngularData.all(this.resource).then(function(data){
            _.each(data.equipments, function(equipment){
                that.lists.push(new Equipment(equipment, this));
            })
        });
    }

    function show(id) {
        var that = this;
        AngularData.show(this.resource, id).then(function(equipment){
            that.model = new Equipment(equipment);
        });
    }

    function create(id, characterId) {
        var deferred = $q.defer();
        $http({method: "POST", url: "/api/add_equipment/"+characterId+"/"+id}).
            success(function(data, status, headers, config){
                deferred.resolve(data)
            }).
            error(function(data, status, headers, config){
                deferred.reject(status)
            });

        return deferred.promise;
    }

    function remove(id, characterId) {
        var deferred = $q.defer();
        $http({method: "DELETE", url: "/api/remove_equipment/"+characterId+"/"+id}).
            success(function(data, status, headers, config){
                deferred.resolve(data)
            }).
            error(function(data, status, headers, config){
                deferred.reject(status)
            });

        return deferred.promise;
    }
}
