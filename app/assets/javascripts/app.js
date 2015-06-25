var zurvives = angular.module('zurvives', ['ui.router', 'ng-token-auth', 'btford.socket-io']);

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
            templateUrl: "partials/register.html",
            controller:'AuthCtrl'
        })
        .state('login', {
            url: "/login",
            templateUrl: "partials/login.html",
            controller:'AuthCtrl'
        })
        .state('profil', {
            views: {
              "@" : {
                  templateUrl: "partials/profil/profil.html",
                  controller: "ProfilCtrl"
              }
            } ,
            url: "/profil",
            onEnter: function (authService, $state) {
                authService.isAuth();
                console.log('here')
            }
        })
        .state('profil.index', {
            url: "/home",
            templateUrl: "partials/profil/index.html"
        })

        .state('profil.characters',{
            url: "/characters",
            templateUrl: "partials/characters/index.html",
            controller: "CharactersController"
        })
        .state('profil.character', {
            url: "/character/:id",
            templateUrl: "partials/characters/show.html",
            controller: "CharactersController"
        })
        .state('profil.newCharacter', {
            url: "/characters/new",
            templateUrl: "partials/characters/new.html",
            controller: "CharactersController"
        })

        .state('profil.editCharacter', {
            url: "/characters/:id/edit",
            templateUrl: "partials/characters/edit.html",
            controller: "CharactersController"
        })

        .state('profil.deleteCharacter', {
            url: "/characters/:id",
            templateUrl: "partials/characters/edit.html",
            controller: "CharactersController"
        })
        .state('games', {
            url: "/games",
            controller: "GamesController",
            templateUrl: "partials/games/index.html",
            onEnter: function (authService) {
                authService.isAuth();
            },

            resolve:{
                promiseObj:  function(socket){
                    socket.removeAllListeners();
                }

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

zurvives.run(function($rootScope, $location, $state, socket) {
    $rootScope.$on('$stateChangeStart', function ( ev, to, toParams, from, fromParams) {
    });
});