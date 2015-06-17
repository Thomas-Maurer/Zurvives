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
        .state('characters',{
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
                if (authService.needsLogin) {
                    return authService.showLogin();
                }
            }
        })
        .state('games.room', {
            url: "/games/:id",
            templateUrl: "partials/games/show.html",
            controller: "GameController"
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