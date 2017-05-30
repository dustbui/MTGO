app.controller("DeckEditCtrl", ["$scope", "$routeParams", "$window", "$timeout", "$sce",
    function ($scope, $routeParams, $window, $timeout, $sce) {

        $scope.uid = $routeParams.uid;
        $scope.deckId = $routeParams.deckId;
        $scope.user = {};
        $scope.deckEdit = {
            name: $scope.deckId,
            cards: [],
        }

        $scope.deckEditTextArea = "";

        $scope.viewCard = function (card) {
            viewCard(card);
        }

        $scope.getManaIcons = getManaIcons;

        $scope.openDeckEditModal = function () {
            openDeckEditModal();
        }

        $scope.saveDeckEditChanges = function () {
            saveDeckEditChanges();
        }

        $scope.parseText = function (text) {
            parseText(text);
        }

        fbGetProfile($scope.uid, function (response) {
            $scope.user = response;
            $scope.$apply();
        });

        fbGetDeck($scope.uid, $scope.deckId, function (response) {
            $scope.deck = response;
            $scope.$apply();
        });

        var justNames = [];

        function saveDeckEditChanges() {
            $scope.deckEdit.cards = justNames;
            fbSaveDeckName($scope.uid, $scope.deckId, $scope.deckEdit);
            $scope.deckId = $scope.deckEdit.name;
            $('#editDeckModal').closeModal();
            Materialize.toast('Saving deck changes.', 1000);
            $timeout(function () {
                $window.location = '#/profile/' + $scope.uid + '/deck/' + $scope.deckId;
            }, 1000);
        }

        function openDeckEditModal() {
            $('#editDeckModal').openModal({
                in_duration: 50,
                out_duration: 50,
            });
        }

        function viewCard(card) {
            $scope.focusedCard = card;
            $('#deckEditCardModal').openModal({
                in_duration: 50,
                out_duration: 50,
            });
        }

        function parseText(text) {
            var lines = text.split('\n');
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                var match = line.match('(\\d*)x'); // Grabs the quantity from a line (i.e. Llanowar Elf x12) x12 is the match.  Parentheses is the second match

                if (match == null) {
                    var error = "Deck list is not formatted properly.  Please use format: \"1x Llanowar Elf\" with a new line separating each card.";
                    Materialize.toast(error, 7000, 'red');
                    console.error(error);
                    return false;
                }

                var quantityDesc = match[0];
                var quantityInt = match[1];
                var card = line.slice(quantityDesc.length + 1); // Retrieves card name minus the quantity

                if (!DEFINED_CARDS[card.toLowerCase()]) {
                    Materialize.toast(card + ' does not exist.', 4000);
                    return;
                }

                for (var j = 0; j < quantityInt; j++) {
                    var newCard = createCard(card.toLowerCase());

                    justNames.push(card);

                    for (var k = 0; k < newCard.abilities.length; k++) {
                        newCard.abilities[k].text = replaceTextIcons(newCard.abilities[k].text.toString());
                        newCard.abilities[k].text = $sce.trustAsHtml(newCard.abilities[k].text.toString());
                    }

                    $scope.deckEdit.cards.push(newCard);
                }
            }
        }

    }]);
