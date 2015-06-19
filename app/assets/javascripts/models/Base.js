'use strict';
var Base = Class.extend({
    init: function(data, service) {
        this.service = service;
        this.origin = data;
        this.setAttributes(data);
    },

    setAttributes: function(data) {
        var that = this;
        $.each(data, function(index, value) {
            if(value.constructor === Array && value.length > 0) {
                var object = _.titleize(_.singularize(index))
                if(window[object]) {
                    value = that.setClassData(window[object], value);
                }
            }
            that[index] = value;
        });
    },

    setClassData: function(name, data) {
        var lists = []
        _.each(data, function(index, value) {
            lists.push(new name(value))
        })
        return lists;
    }
});

Base.$inject = ["$q", "$http"]