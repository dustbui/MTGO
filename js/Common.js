/*  
    Lowercase = app-use
    Uppercase = client-use
*/

/* Used by controllers */
app = angular.module("ows", ['ui.materialize', 'infinite-scroll', 'firebase', 'ngRoute', 'ngAnimate', 'chart.js']);

config = {
    apiKey: "AIzaSyCtLQxQWna9zi-gywncXguV8Fc1q9ompNA",
    authDomain: "overwatch-strategy.firebaseapp.com",
    databaseURL: "https://overwatch-strategy.firebaseio.com",
    storageBucket: "",
};

fb = firebase.initializeApp(config);

provider = new firebase.auth.FacebookAuthProvider();

app.config(function ($routeProvider) {
    $routeProvider.
    when('/lobby', {
        templateUrl: 'html/views/Lobby.html',
        controller: 'LobbyCtrl'
    }).
    when('/game/:gameId', {
        templateUrl: 'html/views/Game.html',
        controller: 'GameCtrl',
        controllerAs: 'game'
    }).
    when('/profile/:uid', {
        templateUrl: 'html/views/Profile.html',
        controller: 'ProfileCtrl'
    }).
    when('/settings', {
        templateUrl: 'html/views/Settings.html',
        controller: 'SettingsCtrl'
    }).
    when('/profile/:uid/deck/:deckId', {
        templateUrl: 'html/views/DeckEdit.html',
        controller: 'DeckEditCtrl'
    }).
    otherwise({
        
    });
});

var totalCards = 0;

function createCard(cardRef) {
    var card = new Card();
    var result = angular.extend(card, DEFINED_CARDS[cardRef]);
    card.id = totalCards++;
    return result;
}

function checkManaCost(cost, manapool, additionalCost) {
    var result = true;
    cost += (additionalCost ? additionalCost : 0);
    if (cost == 0) return true;
    for (var i = 0; i < cost.length; i++) {
        result = false;
        for (var j; j < manapool.length; j++) {
            var tempMana = manapool[i];
            var tempManaCost = cost[i];
            if (!tempMana.used && ((tempMana.color == tempManaCost.color) || tempManaCost.color == '{A}')) {
                tempMana.used = true;
                result = true;
                break;
            }
        }
        if (!result) {
            Materialize.toast('Unable to pay cost for ability.', 3000);
        }
    }
    return result;
}

function getManaIcons(mana) {
    return MANA_ICONS[mana];
}

function replaceTextIcons(text) {
    var regex = /{[A-Z]}/g;
    var newText = text;

    do {
        var match = regex.exec(text);
        if (match == null) return newText;
        var manaIcon = "<i class='ms-text ms ms-cost " +  getManaIcons(match[0]) + "\'></i>";
        newText = newText.replace(match[0], manaIcon);
    } while (match != null);
}

MANA_ICONS = {
    '{G}': 'ms-g',
    '{U}': 'ms-u',
    '{W}': 'ms-w',
    '{B}': 'ms-b',
    '{R}': 'ms-r',
    '{C}': 'ms-c',
    '{P}': 'ms-p',
    '{S}': 'ms-s',
    '{1}': 'ms-1',
    '{2}': 'ms-2',
    '{3}': 'ms-3',
    '{4}': 'ms-4',
    '{5}': 'ms-5',
    '{6}': 'ms-6',
    '{7}': 'ms-7',
    '{8}': 'ms-8',
    '{9}': 'ms-9',
    '{10}': 'ms-10',
    '{11}': 'ms-11',
    '{12}': 'ms-12',
    '{13}': 'ms-13',
    '{14}': 'ms-14',
    '{15}': 'ms-15',
    '{16}': 'ms-16',
    '{17}': 'ms-17',
    '{18}': 'ms-18',
    '{19}': 'ms-19',
    '{T}': 'ms-tap',
    '{UT}': 'ms-untap',
    '{LU}': 'ms-loyalty-up',
    '{LD}': 'ms-loyalty-down',
    '{LZ}': 'ms-loyalty-zero',
    '{LS}': 'ms-loyalty-start',
}
