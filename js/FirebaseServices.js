/* Users */

function fbGetUser(uid, callback) {
    fb.database().ref('/users/' + uid).once('value').then(function (snapshot) {
        callback(snapshot.val());
    });
}

function fbWriteUserData(user) {
    fb.database().ref('users/' + user.uid).set({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        providerData: user.providerData
    });
}

/* Decks */
function fbCreateDeck(uid, deck, callback) {
    fb.database().ref('decks/' + uid + '/' + deck.name).set(deck);
}

function fbGetDeck(uid, deckName, callback) {
    fb.database().ref('decks/' + uid + '/' + deckName).once('value').then(function (snapshot) {
        callback(snapshot.val());
    });
}

function fbSaveDeckContent(uid, deck) {
    fb.database().ref('decks/' + uid + '/' + deck.name).set(deck);
}

function fbSaveDeckName(uid, oldDeckName, newDeck) {
    var oldDeck = fb.database().ref('decks/' + uid + '/' + oldDeckName);
    oldDeck.once('value').then(function (snapshot) {
        fb.database().ref('decks/' + uid + '/' + newDeck.name).set(snapshot.val());
        fb.database().ref('decks/' + uid + '/' + newDeck.name + '/name').set(newDeck.name);
        fbSaveDeckContent(uid, newDeck);
        if (oldDeckName != newDeck.name) oldDeck.remove();
    });
}

/* Games */

function fbCreateGame(game) {
    var checkStatus = false;
    fb.database().ref('games/' + game.id).set(game);
}

function fbGetGame(gameId, callback) {
    fb.database().ref('games/' + gameId).once('value').then(function (snapshot) {
        callback(snapshot.val());
    });
}

function fbGetGames() {
    fb.database().ref('games/').once('value').then(function (snapshot) {
        return snapshot.val();
    });
}

function fbGetProfile(uid, callback) {
    fb.database().ref('users/' + uid).once('value').then(function (snapshot) {
        callback(snapshot.val());
    });
}

function fbUpdateGameStack(gameId, stack) {
    var newStack = new Stack(stack);
    toStringStackFunctions(newStack);
    fb.database().ref('games/' + gameId + /stack/).set(newStack);
}

function fbPassTurn(gameId, opponentId) {
    if (!opponentId) {
        console.log('No opponent defined.');
        return;
    }
    fb.database().ref('games/' + gameId + '/currentPlayersTurn/').set(opponentId);
}

function fbPassPriority(gameId, opponentId) {
    if (!opponentId) {
        console.log('No opponent defined.');
        return;
    }
    fb.database().ref('games/' + gameId + '/currentPriority/').set(opponentId);
}

function fbChangePhase(gameId, toPhase) {
    fb.database().ref('games/' + gameId + '/currentPhase/').set(toPhase);
}

function fbUpdateBattlefield(gameId, battlefield) {
    var newBattlefield = new Battlefield();
    angular.copy(battlefield.cards, newBattlefield.cards);
    toStringCardDefinitions(newBattlefield);
    fb.database().ref('games/' + gameId + '/battlefield/').set(newBattlefield);
}

function fbUpdatePlayers(gameId, players) {
    angular.forEach(players, function (player) {
        for (var i = 0; i < player.manapool.mana.length; i++) {
            removeHashKey(player.manapool.mana[i]);
        }
    });
    fb.database().ref('games/' + gameId + '/players/').set(players);
}

function toStringStackFunctions(stack) {
    angular.forEach(stack.stackElements, function (stackElement) {
        stackElement.effects = stackElement.effects.toString();
    });
}

function toStringCardDefinitions(battlefield) {
    angular.forEach(battlefield.cards, function (card) {
        if (card.abilities) {
            for (var i = 0; i < card.abilities.length; i++) {
                if (!angular.isString(card.abilities[i]))
                    card.abilities[i] = card.abilities[i].constructor.name;
            }
        }
    });
}

function removeHashKey(object) {
    delete object['$$hashKey'];
}
