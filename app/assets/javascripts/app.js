var zurvives = angular.module('zurvives', ['ui.router', 'ng-token-auth']);
zurvives.config(function($stateProvider, $urlRouterProvider, $authProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "views/home.html"
        })
        .state('profil', {
            url: "/profil",
            templateUrl: "partials/profil.html"
        })
        .state('register', {
            url: "/register",
            templateUrl: "partials/register.html"
        });


    $authProvider.configure({
        apiUrl: ''
        ,
        handleLoginResponse: function (response) {
            return response.data;
        }
    });
});

