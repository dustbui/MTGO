app.controller("LobbyCtrl", ["$scope", "$location", "$timeout",
    function ($scope, $location, $timeout) {
        
        $scope.games = {};
        
        $scope.createGameModel = new Game();

        var gamesRef = firebase.database().ref('games/');
        gamesRef.on('child_added', function (data) {
            $timeout(addGameChild(data.val())); // use $timeout to avoid $digest issues with $apply
        });

        gamesRef.on('child_changed', function (data) {
            $timeout(changeGameChild(data.val()));
        });

        gamesRef.on('child_removed', function (data) {
            $timeout(removeGameChild(data.val()));
        });
        
        function addGameChild (game) {
            $scope.games[game.id] = game;
        }
        
        function changeGameChild (game) {
            $scope.games[game.id] = game;
        }
        
        function removeGameChild (game) {
            delete $scope.games[game.id];
        }
        
        function redirectToGame(id) {
            console.log("Navigating to Game " + id);
            $timeout(function(){
                $location.path('/game/' + id);
                Materialize.toast('Joined Game ' + id, 4000);
            });
        }
        
        
        function gameExists(gameId, existsCallback, nullCallback) {
            fbGetGame(gameId, function(response) {
                if (response != null) {
                    existsCallback();    
                } else {
                    nullCallback();
                }
            });
        }
        
        function gameExistsAction() {
            Materialize.toast('Room Code already exists.', 4000);
        }
        
        function gameDoesntExistAction() {
            $scope.createGameModel.players[$scope.$parent.user.uid] = (new Player($scope.$parent.user));
            $scope.createGameModel.creatorId = $scope.$parent.user.uid;
            $scope.createGameModel.creatorName = $scope.$parent.user.displayName;
            redirectToGame($scope.createGameModel.id);
            fbCreateGame($scope.createGameModel);
        }
        
        $scope.getGamePlayerCount = function(game) {
            return Object.keys(game.players).length;
        }
        
        $scope.createGame = function(isValid) {
            if (isValid) {
                gameExists($scope.createGameModel.id, gameExistsAction, gameDoesntExistAction);
            }
        }
        
        $scope.joinGame = function(id) {
            redirectToGame(id);
        }
        
        $scope.searchGame = function(id) {
            gameExists(id, function searchGameCallback() { $scope.joinGame(id); }, function searchGameNullCallback(){ Materialize.toast('Game ' + id + ' does not exist.', 2000); });
        }
        
    }]);
