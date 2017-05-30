DEFINED_CARDS = {};

var card = new Card();

//var llanowarElf = card;
card = new Card();
card.id = 'llanowarElf' + '_init';
card.cost = ['{G}'];
card.name = 'Llanowar Elves';
card.types = {
    Creature: true,
};
card.subtypes = {
    Elf: true,
};
card.abilities = [new addGreenManaAbility(card)];
card.power = 1;
card.toughness = 1;
card.sickness = true;
DEFINED_CARDS['llanowar elves'] = card;

//var forest = new Card();
card = new Card();
card.id = 'forest' + '_init';
card.name = 'Forest';
card.types = {
    Basic: true,
    Land: true,
};
card.subtypes = {
    Forest: true,
};
card.sickness = false;
card.abilities = [new addGreenManaAbility(card)];
DEFINED_CARDS['forest'] = card;

