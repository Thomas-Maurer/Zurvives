'use strict';

angular
    .module('zurvives')
    .factory('skillService', skillService);

skillService.$inject = ["AngularData"]
function skillService(AngularData) {
    var service = {
        all: all,
        show: show,
        create: create,
        remove: remove,
        resource: "skills",
        lists: []
    }

    return service;

    function all() {
        var that = this;
        return AngularData.all(this.resource);
    }

    function show(id) {
        var that = this;
        AngularData.show(this.resource, id).then(function(skill){
            that.model = new Skill(skill);
        });
    }

    function create(id, characterId) {
        var deferred = $q.defer();
        $http({method: "POST", url: "/api/add_skill/"+characterId+"/"+id}).
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
        $http({method: "DELETE", url: "/api/remove_skill/"+characterId+"/"+id}).
            success(function(data, status, headers, config){
                deferred.resolve(data)
            }).
            error(function(data, status, headers, config){
                deferred.reject(status)
            });

        return deferred.promise;
    }

}
