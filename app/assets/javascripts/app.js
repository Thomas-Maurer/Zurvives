var zurvives = angular.module('zurvives', ['ui.router']);
zurvives.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "views/home.html"
        })
});
