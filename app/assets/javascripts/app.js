var zurvives = angular.module('zurvives', ['ui.router', 'ng-token-auth']);

zurvives.config(['$stateProvider', '$urlRouterProvider', '$authProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $authProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $urlRouterProvider.otherwise(function ($injector, $location) {
        var $state;
        $state = $injector.get("$state");
        return $state.go("home");
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
            controller: "ProfilCtrl",
            onEnter: function (authService) {
                authService.isAuth();
            }
        })

        .state('profil.characters',{
            url: "/characters",
            templateUrl: "partials/characters/index.html",
            controller: "CharactersController",
            onEnter: function (authService) {
                authService.isAuth();
            }
        })
        .state('profil.character', {
            url: "/character/:id",
            templateUrl: "partials/characters/show.html",
            controller: "CharacterController"
        })
        .state('games', {
            url: "/games",
            controller: "GamesController",
            templateUrl: "partials/games/index.html",
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