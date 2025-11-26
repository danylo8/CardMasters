const cardType = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const cardNum = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let originalDeck = [];
let playerDeck = [];
let oppsDeck = [];
let activeDeck = [];

let passedCard = null;         // Card being passed between players
let playerTurn = true;
let gameOver = false;
let playerEliminated = false;
let spoonTaken = false;
intitalizeDeck();
dealCards();

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

    for (let i = 0; i < 4; i++) {
        playerDeck.push(originalDeck.pop());
        oppsDeck.push(originalDeck.pop());
    }

    activeDeck = [...originalDeck];

    spoonTaken = false;
    gameOver = false;
    playerEliminated = false;

    let rand = Math.random();
    if (rand < 0.5) {
        playerTurn = true;
        logMessage("Game started. You are the dealer.");
    } else {
        playerTurn = false;
        logMessage("Game started. Opponent is the dealer.");
        setTimeout(oppMove, 1200);
    }

    updateUI();
}

function updateUI() {
    let playerHand = document.getElementById('player-hand-1');
    playerHand.innerHTML = '';
    for (let i = 0; i < playerDeck.length; i++) {
        let card = document.createElement('img');
        card.src = `cards/${playerDeck[i].value} of ${playerDeck[i].suit}.png`;
        card.alt = `${playerDeck[i].value} of ${playerDeck[i].suit}`;
        card.onclick = function () { playerMove(i); };
        playerHand.appendChild(card);
    }

    document.getElementById('opponent-count-1').innerText = oppsDeck.length;
    document.getElementById('pile-count-1').innerText = activeDeck.length;
}

function playerMove() {
    if (gameOver || !playerTurn || activeDeck.length === 0) return;

    let drawnCard = activeDeck.pop();
    document.getElementById('pile-count-1').innerText = activeDeck.length;
    logMessage("You drew a card.");


    askKeepCard(drawnCard);
}


function askKeepCard(card) {
    const popup = document.getElementById('card-choice-popup');
    document.getElementById('card-choice-text').innerText = `Keep ${card.value} of ${card.suit}?`;
    popup.style.display = 'flex';

    document.getElementById('card-keep').onclick = () => {
        popup.style.display = 'none';
        applyPlayerDecision(true, card);
    };

    document.getElementById('card-pass').onclick = () => {
        popup.style.display = 'none';
        applyPlayerDecision(false, card);
    };
}

function applyPlayerDecision(keepIt, newCard) {
    if (keepIt) {
        const discarded = playerDeck.shift();
        playerDeck.push(newCard);
        passedCard = discarded;
        logMessage('You kept the new card and passed one.');
    } else {
        passedCard = newCard;
        logMessage('You passed the new card.');
    }

    updateUI();

    if (checkFourOfAKind(playerDeck)) {
        logMessage("You have four of a kind! Grab a spoon!");
        document.getElementById('spoon-button').style.display = 'inline';
    }

    playerTurn = false;
    setTimeout(oppMove, 1200);
}


function oppMove() {
    if (gameOver) return;

    if (passedCard) {
        oppsDeck.push(passedCard);
        let discard = oppsDeck.shift();
        passedCard = discard;
        logMessage(`Opponent received a passed card and discarded ${discard.value} of ${discard.suit}.`);
    } else if (activeDeck.length >= 0) {
        let drawn = activeDeck.pop();
        document.getElementById('pile-count-1').innerText = activeDeck.length;

        let keep = Math.random() < 0.5;

        if (keep) {
            let discard = oppsDeck.shift();
            oppsDeck.push(drawn);
            passedCard = discard;
            logMessage(`Opponent kept ${drawn.value} of ${drawn.suit} and discarded ${discard.value} of ${discard.suit}.`);
        } else {
            passedCard = drawn;
            logMessage(`Opponent passed ${drawn.value} of ${drawn.suit} to you.`);
        }
    }

    updateUI();

    if (checkFourOfAKind(oppsDeck)) {
        logMessage("Opponent has four of a kind! They grabbed a spoon.");
        playerEliminated = true;
        gameOver = true;
        setTimeout(resetGame, 4000);
        return;
    }

    playerTurn = true;
}

function checkFourOfAKind(deck) {
    let count = {};
    for (let i = 0; i < deck.length; i++) {
        let val = deck[i].value;
        count[val] = (count[val] || 0) + 1;
        if (count[val] === 4) return true;
    }
    return false;
}

function logMessage(message) {
    let messageBox = document.getElementById('message-1');
    messageBox.innerText += '\n' + message;
    messageBox.scrollTop = messageBox.scrollHeight;
}

function grabSpoon() {
    if (!spoonTaken) {
        spoonTaken = true;
        logMessage("You grabbed a spoon!");
    } else {
        playerEliminated = true;
        logMessage("Too late! You're eliminated.");
    }
    gameOver = true;
    document.getElementById('pile-count-1').innerText = activeDeck.length;
    setTimeout(resetGame, 4000);
}

function resetGame() {
    intitalizeDeck();
    dealCards();
    document.getElementById('pile-count-1').innerText = activeDeck.length;
}

function openPopup() {
    intitalizeDeck();
    dealCards();
    updateUI();
    document.getElementById('spoons-popup').style.display = 'flex';
}


function closePopup() {
    document.getElementById('spoons-popup').style.display = 'none';
}
