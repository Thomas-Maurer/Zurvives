var zurvives = angular.module('zurvives', ['ui.router', 'ng-token-auth']);
zurvives.config(['$stateProvider', '$urlRouterProvider', '$authProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $authProvider,$locationProvider) {

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "partials/home.html"
        })
        .state('profil', {
            url: "/profil",
            templateUrl: "partials/profil.html"
        })
        .state('register', {
            url: "/register",
            templateUrl: "partials/register.html"
        })
        .state('login', {
            url: "/login",
            templateUrl: "partials/login.html"
        })
        .state('board', {
            url: "/board",
            templateUrl: "partials/board.html"
        });
    $urlRouterProvider.otherwise("/");

    $authProvider.configure({
        apiUrl: '',
        handleLoginResponse: function (response) {
            return response.data;
        }
    });

}]);