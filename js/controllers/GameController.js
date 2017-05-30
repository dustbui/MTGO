app.controller("GameCtrl", ["$scope", "$routeParams", "$timeout", "$sce", 
    function ($scope, $routeParams, $timeout, $sce) {

        $scope.game = new Game();

        $scope.focusedCard = new Card();
        
        $scope.getManaIcons = getManaIcons;
        
        replaceTextIcons('Add {G} to your mana pool. {U}');

        fbGetGame($routeParams.gameId, function (response) {
            $scope.game = response;
            angular.merge($scope.game, new Game());
            $scope.game.id = $routeParams.gameId;
            $scope.spectating = true;

            angular.forEach($scope.game.players, function (value, key) {
                angular.merge(value, new Player(value));
                if (value.uid == $scope.$parent.user.uid) {
                    $scope.game.player = value;
                } else {
                    $scope.game.opponent = value;
                }
            });


            // Determine if player in game is spectating
            angular.forEach($scope.game.players, function (value, key) {
                if ($scope.$parent.user.uid == value.uid) $scope.spectating = false;
            });

            // TEST // 
            $scope.game.opponent.displayName = 'Bob Saget';
            $scope.game.opponent.uid = 'bnYQOmCwetUiaTzn8YSrB5OvAAAA';
            $scope.game.opponent.life = 20;

            $scope.game.currentPlayersTurn = 'bnYQOmCwetUiaTzn8YSrB5OvQOs2';
            //            $scope.game.cardMap[llanowarElf.id] = llanowarElf;

//            var c1 = createCard('llanowarElf');
//            var c2 = createCard('forest');
//            $scope.game.battlefield.cards[c1.id] = c1;
//            $scope.game.battlefield.cards[c2.id] = c2;

            // Firebase Listeners // 
            var gamesRef = firebase.database().ref('games/' + $routeParams.gameId + '/battlefield/cards');
            gamesRef.on('child_added', function (data) {
                $timeout(addGameChild(data.val())); // use $timeout to avoid $digest issues with $apply
            });

            gamesRef.on('child_changed', function (data) {
                $timeout(changeGameChild(data.val()));
            });

            gamesRef.on('child_removed', function (data) {
                $timeout(removeGameChild(data.val()));
            });

            function addGameChild(card) {
                $scope.game.battlefield.cards[card.id] = card;
                mapAbilities(card);
            }

            function changeGameChild(card) {
                $scope.game.battlefield.cards[card.id] = card;
                mapAbilities(card);
            }

            function removeGameChild(card) {
                delete $scope.game.battlefield.cards[card.id];
            }


            $scope.$apply();
        });

        $scope.useAbility = function (abilityInput, source) {
            var ability = abilityInput;
            var valid = true;
            var paid = true;

            // Check controller
            if (source.controller != $scope.game.player.uid) {
                Materialize.toast('You do not own ' + source.name, 3000);
                valid = false;
            }

            // Check conditions on source
            angular.forEach(ability.conditions.source, function (value, key) {
                if (valid) {
                    var propertyBoolean = source[key];
                    if ((propertyBoolean && (propertyBoolean != value)) || (value && propertyBoolean == undefined)) {
                        Materialize.toast('Expected ' + key + ' to be ' + value, 3000);
                        valid = false;
                    }
                }
            });

            // Check mana costs
            var tempManaPool = new Manapool($scope.game.player.manapool).mana;
            paid = checkManaCost(ability.manaCost, tempManaPool);

            // Choose targets + check conditions on target (if applicable)
            angular.forEach(ability.conditions.target, function (value, key) {
                if (valid) {

                }
            });

            if (!valid || !paid) return;

            // Pay card property costs
            angular.forEach(ability.propertyCost, function (value, key) {
                source[key] = value;
            });

            // Pay mana costs
            for (var i = tempManaPool.length - 1; i > 0; i--) {
                if (tempManaPool[i].used) {
                    $scope.game.player.manapool.mana.splice(i, 1);
                }
            }


            var constructorForStackElement = 'new ' + ability.stackElement.constructor.name + '(source, ability.targets);';
            pushStack(eval(constructorForStackElement));

            /* Resolve immediately if tag is mana ability */
            if (ability.stackElement.tags['mana-ability']) resolveStack();
        }

        $scope.resolveFirstStackElement = function () {
            resolveStack();
        }

        $scope.viewCard = function (card) {
            viewCard(card);
        }

        $scope.changePhase = function (fromPhase, toPhase) {
            changePhase(fromPhase, toPhase);
        }

        $scope.passTurn = function () {
            passTurn();
        }

        function viewCard(card) {
            $scope.focusedCard = card;
            $('#cardModal').openModal({
                in_duration: 50,
                out_duration: 50,
            });
        }

        function resolveStack() {
            var topStackElement = $scope.game.stack.stackElements.pop();
            if (!topStackElement) return;
            topStackElement.effects($scope.game);
            fbUpdateGameStack($scope.game.id, $scope.game.stack);
            fbUpdateBattlefield($scope.game.id, $scope.game.battlefield);
            fbUpdatePlayers($scope.game.id, $scope.game.players);
            passPriority();
        }

        function pushStack(stackElement) {
            $scope.game.stack.stackElements.push(stackElement);
            fbUpdateGameStack($scope.game.id, $scope.game.stack);
            fbUpdateBattlefield($scope.game.id, $scope.game.battlefield);
            fbUpdatePlayers($scope.game.id, $scope.game.players);
            passPriority();
        }

        function changePhase(fromPhase, toPhase) {
            passPriority();
            determinePhaseActions(fromPhase, toPhase);
            fbChangePhase($scope.game.id, toPhase);
            Materialize.toast("Moving to " + toPhase + " phase.", 1500);
        }

        function determinePhaseActions(fromPhase, toPhase) {
            if (fromPhase == 'untap' && toPhase == 'upkeep') {
                untapPhase($scope.game.currentPlayersTurn);
            }
        }

        function untapPhase(playerUid) {
            angular.forEach($scope.game.battlefield.cards, function (card) {
                if (card.controller == playerUid) {
                    if (!card.tapStasis) {
                        card.tapped = false;
                    }
                }

            });
        }

        function passTurn() {
            fbPassTurn($scope.game.id, $scope.game.opponent.uid);
        }

        function passPriority() {
            // TODO: see if opponent does anything with this priority
            fbPassPriority($scope.game.id, $scope.game.opponent.uid);
        }

        function mapAbilities(card) {
            $scope.game.battlefield.cards[card.id] = card;
            for (var i = 0; i < card.abilities.length; i++) {
//                var cardText = card.abilities[i].text;
                card.abilities[i] = eval('new ' + card.abilities[i] + '(card);');
                card.abilities[i].text = replaceTextIcons(card.abilities[i].text);
                card.abilities[i].text = $sce.trustAsHtml(card.abilities[i].text); // Allow for replacement of text with mana icons
            }
        }

    }]);
