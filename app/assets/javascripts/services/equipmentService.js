'use strict';

angular
    .module('zurvives')
    .factory('equipmentService', equipmentService);

equipmentService.$inject = ["AngularData", "$q", "$http"]
function equipmentService(AngularData, $q, $http) {
    var service = {
        all: all,
        show: show,
        create: create,
        remove: remove,
        addWeapon: addWeapon,
        removeWeapon: removeWeapon,
        resource: "equipments",
        lists: []
    }

    return service;

    function all() {
        var that = this;
        return AngularData.all(this.resource);
    }

    function show(id) {
        var that = this;
        return AngularData.show(this.resource, id)
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

    function addWeapon(id, characterId) {
        var deferred = $q.defer();
        $http({method: "POST", url: "/api/add_weapon/"+characterId+"/"+id}).
            success(function(data, status, headers, config){
                deferred.resolve(data)
            }).
            error(function(data, status, headers, config){
                deferred.reject(status)
            });

        return deferred.promise;
    }

    function removeWeapon(id, characterId) {
        var deferred = $q.defer();
        $http({method: "DELETE", url: "/api/remove_weapon/"+characterId+"/"+id}).
            success(function(data, status, headers, config){
                deferred.resolve(data)
            }).
            error(function(data, status, headers, config){
                deferred.reject(status)
            });

        return deferred.promise;
    }
}
