function addGreenManaAbility(source) {
    Ability.call(this, source);
    var thisAbility = this;
    this.text = "{T}: Add {G} to your mana pool."
    this.conditions.source = { // conditions.target will check for hexproof/shroud
        tapped: false,
        sickness: false,
        silenced: false,
    };
    this.propertyCost = {
        tapped: true,
    }
    this.stackElement = new addGreenManaStackElement(thisAbility.source, thisAbility.targets);
    this.tags.active = true;
}

function addGreenManaStackElement(source, targets) {
    StackElement.call(this);
    this.id = 'createGreenMana' + Date.now();
    this.tags = {
        ability: true,
        'mana-ability': true
    };
    this.effects = function (game) {
        var mana = new Mana();
        mana.color = '{G}';
        mana.source = source.id;
        game.players[source.controller].manapool.mana.push(mana);
        Materialize.toast("Added {G} mana.", 1000);
        console.log(game.players);
    };
}

