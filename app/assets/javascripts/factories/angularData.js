'use strict';

angular
    .module('zurvives')
    .factory('AngularData', AngularData);

AngularData.$inject = ["$q", "$http"];

function AngularData($q, $http) {
    var that = this;
    var service = {
        all: all,
        show: show,
        create: create,
        update: update,
        remove: remove,
        fetch: fetch

    }

    return service;

    function fetch(resource, method, data, id) {
        var url = '/api/'+resource;

        if(id) {
            url = '/api/'+resource+'/'+id;
        }
        var deferred = $q.defer();
        $http({method: method, url: url, data: data }).
            success(function(data, status, headers, config){
                deferred.resolve(data)
            }).
            error(function(data, status, headers, config){
                deferred.reject(status)
            });

        return deferred.promise;
    }

    function all(resource) {
        return this.fetch( resource, "GET");
    }

    function show(resource, id) {
        return this.fetch(resource, "GET", "undefined", id)
    }

    function create(resource, data) {
        return this.fetch( resource, "POST", data);
    }

    function update(resource, data, id) {
        return this.fetch(resource, "PUT", data, id)
    }

    function remove(resource, id) {
        return this.fetch(resource, "DELETE", "undefined", id)
    }

}
