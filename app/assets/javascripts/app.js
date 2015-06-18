var zurvives = angular.module('zurvives', ['ui.router', 'ng-token-auth']);
zurvives.config(['$stateProvider', '$urlRouterProvider', '$authProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $authProvider, $locationProvider) {

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "partials/home.html"
        })
        .state('register', {
            url: "/register",
            templateUrl: "partials/register.html"
        })
        .state('login', {
            url: "/login",
            templateUrl: "partials/login.html"
        })
        .state('profil', {
            url: "/profil",
            templateUrl: "partials/profil.html",
            onEnter: function (authService, $location) {
                authService.isAuth();
            }
        })
        .state('characters', {
            url: "/characters",
            templateUrl: "partials/characters/index.html",
            controller: "CharactersController",
            onEnter: function (authService) {
                authService.isAuth();
            }
        })
        .state('characters.character', {
            url: "/character/:id",
            templateUrl: "partials/characters/show.html",
            controller: "CharacterController"
        })
        .state('games', {
            url: "/games",
            templateUrl: "partials/games/index.html",
            controller: "GamesController",
            onEnter: function (authService) {
                authService.isAuth();
            }
        })
        .state('play', {
            url: "/game/:slug",
            templateUrl: "/partials/games/singleGame.html",
            controller: "singleGameController"
        });

    $urlRouterProvider.otherwise("/");

    $authProvider.configure({
        apiUrl: '',
        handleLoginResponse: function (response) {
            return response.data;
        }
    });

}]);