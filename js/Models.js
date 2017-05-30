function Deck() {
    this.name = 'NewDeck';
    this.cards = [];
    this.sideboard = {
        cards: []
    }
}

function Lobby() {
    this.games = {};
}

function Game() {
    this.id = null;
    this.creatorId = null;
    this.creatorName = '';
    this.name = '';
    this.players = {};
    this.status = 'Open';
    this.private = false;
    this.password = '';
    this.actions = [];
    this.currentPlayersTurn = -1; // player ID
    this.currentPriority = -1; // 
    this.currentPhase = 'untap';
    this.cardMap = {};
    this.stack = new Stack();
    this.player = {};
    this.opponent = {};
    this.battlefield = new Battlefield();
    this.turnNumber = 0;
}

function Player(user) {
    this.displayName = user.displayName || null;
    this.uid = user.uid || null;
    this.library = new Library();
    this.graveyard = new Graveyard();
    this.exile = new Exile();
    this.hand = new Hand();
    this.life = 20;
    this.manapool = new Manapool();
    this.playmat = null;
}

function Library() {
    this.cards = []; // Remember to make all these facedown to all players
}

function Battlefield() {
    this.cards = {};
}

function Graveyard() {
    this.cards = [];
}

function Exile() {
    this.cards = [];
}

function Hand() {
    this.max = 7;
    this.cards = [];
}

function Card() {
    this.id = null; // Primary key for referecing rules against a specific instance of this card in the game.
    this.links = {}; // i.e. Exiled by Fiend Hunter: { 'exiled by': FIEND_HUNTER_ID}    Fiend Hunter: {'exiling': TARGET_ID}
    this.cost = []; // Array of Mana objects. Make sure {A} is last so that low priority mana is used last.
    this.color = null;
    this.name = null; // Primary key for pulling cards from db
    this.types = {}; // Card Type (i.e. Legendary, Sorcery, Creature)
    this.subtypes = {}; // Subtype (i.e. Elemental, Arcane, Trap)
    this.power = 0;
    this.toughness = 0;
    this.set = null;
    this.artURL = null;
    this.faceDown = {
            all: false
        } // Per player id (i.e. {Player1: true, Player2: false})
    this.abilities = [];
    this.tapped = false;
    this.sickness = true;
}

function Ability(source) {
    this.id = source.id + 'Ability' + Date.now();
    this.text = "";
    this.propertyCost = {};
    this.manaCost = [];
    this.source = source || null;
    this.conditions = {
        source: {}
    };
    this.targets = {
        number: 0,
        tags: {},
    };
    this.stackElement = null;
    this.tags = {
        active: false
    };
}

function Stack() {
    this.stackElements = [];
}

function StackElement() {
    this.id = null;
    this.name = '';
    this.type = null; // spell or ability
    this.tags = {}; // spell, ability, uncounterable, protection,
    this.cost = [];
    this.effects = {};
    this.tags = {
        
    };
}

function Effect() {
    this.id = null;
    this.source = null;
    this.target = null;
}

function Manapool() {
    this.mana = [];
}

function Mana() {
    this.color = null;
    this.source = null; // Helpful for Myr Superion. If used in a Card cost, source indicates the specific source needed for the card.
    this.target = null; // Helpful for mana usable for specific types of cards (Myr Superion)
}
