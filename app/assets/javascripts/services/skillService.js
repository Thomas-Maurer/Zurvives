'use strict';

angular
    .module('zurvives')
    .factory('Service', skillService);

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
        AngularData.all(this.resource).then(function(data){
            _.each(data.skills, function(skill){
                that.lists.push(new Skill(equipment, this));
            })
        });
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
