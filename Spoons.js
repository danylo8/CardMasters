const cardType = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const cardNum = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let originalDeck = [];
let playerDeck = [];
let oppsDeck = [];
let discardDeck = [];

let spoonsPile = [];
let passedCard= null;
let playerTurn = true;




function shuffleCards(deck) {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function intitalizeDeck() {
    originalDeck = [];
    for (let i = 0; i < cardType.length; i++) {
        for (let j = 0; j < cardNum.length; j++) {
            originalDeck.push({ value: cardNum[j], suit: cardType[i] });
        }
    }
    shuffleCards(originalDeck);
}


function dealCards() {
    playerDeck = [];
    oppsDeck = [];
    for (let i = 0; i < 8; i++) {
        if (i % 2 === 0)
            playerDeck.push(originalDeck[i]);
        else
            oppsDeck.push(originalDeck[i]);
    }
}


let rand = Math.random();
if (rand < 0.5) {
    playerTurn = true;
    logMessage("You go first.");
} else {
    playerTurn = false;
    logMessage("Opponent goes first.");
    setTimeout(oppMove, 1200);
}

