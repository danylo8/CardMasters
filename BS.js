const cardType = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const cardNum = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let originalDeck = [];
let playerDeck = [];
let oppsDeck = [];
let activeDeck = [];

let expectedCard = 0;
let lastExpectedCard = 0;
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
    for (let i = 0; i < originalDeck.length; i++) {
        if (i % 2 === 0)
            playerDeck.push(originalDeck[i]);
        else
            oppsDeck.push(originalDeck[i]);
    }

    let playerHasAceSpades = false;
    let oppHasAceSpades = false;

    for (let i = 0; i < playerDeck.length; i++) {
        if (playerDeck[i].value === 'A' && playerDeck[i].suit === 'Spades') {
            playerHasAceSpades = true;
        }
    }

    for (let i = 0; i < oppsDeck.length; i++) {
        if (oppsDeck[i].value === 'A' && oppsDeck[i].suit === 'Spades') {
            oppHasAceSpades = true;
        }
    }

    if (playerHasAceSpades) {
        playerTurn = true;
        logMessage("You have the Ace of Spades. You go first.");
    } else if (oppHasAceSpades) {
        playerTurn = false;
        logMessage("Opponent has the Ace of Spades. They go first.");
        setTimeout(oppMove, 1200);
    } else {
        let rand = Math.random();
        if (rand < 0.5) {
            playerTurn = true;
            logMessage("You go first.");
        } else {
            playerTurn = false;
            logMessage("Opponent goes first.");
            setTimeout(oppMove, 1200);
        }
    }
}

function updateUI() {
    let playerHand = document.getElementById('player-hand');
    playerHand.innerHTML = '';
    for (let i = 0; i < playerDeck.length; i++) {
        let card = document.createElement('img');
        card.src = `cards/${playerDeck[i].value} of ${playerDeck[i].suit}.png`;
        card.alt = `${playerDeck[i].value} of ${playerDeck[i].suit}`;
        card.onclick = function () { playerMove(i); };
        playerHand.appendChild(card);
    }

    document.getElementById('player-count').innerText = playerDeck.length;
    document.getElementById('opponent-count').innerText = oppsDeck.length;
    document.getElementById('pile-count').innerText = activeDeck.length;
    document.getElementById('claim-label').innerText = cardNum[expectedCard];
}

function playerMove(i) {
    if (!playerTurn) {
        logMessage("Wait for your turn.");
        return;
    }

    if (playerDeck.length === 0) {
        logMessage("You have no cards left!");
        return;
    }

    let playedCard = playerDeck.splice(i, 1)[0];
    activeDeck.push(playedCard);
    logMessage("You put down a card claiming it's a " + cardNum[expectedCard] + ".");

    lastExpectedCard = expectedCard;
    expectedCard++;
    if (expectedCard === cardNum.length) expectedCard = 0;

    updateUI();
    playerTurn = false;
    setTimeout(oppMove, 1200);
}

function oppMove() {
    if (oppsDeck.length === 0) {
        logMessage("Opponent has no cards left!");
        checkWin();
        return;
    }

    let callChance = Math.random();
    if (callChance < 0.2) {
        callBS(true);
        setTimeout(oppMove, 1200);
        return;
    }

    let oppCard = oppsDeck.shift();
    activeDeck.push(oppCard);
    logMessage("Opponent put down a card claiming it's a " + cardNum[expectedCard] + ".");

    lastExpectedCard = expectedCard;
    expectedCard++;
    if (expectedCard === cardNum.length)
        expectedCard = 0;

    updateUI();
    checkWin();
    playerTurn = true;
}

function callBS(byOpponent) {
    if (activeDeck.length === 0) {
        logMessage("Nothing to call BS on!");
        return;
    }

    let lastCard = activeDeck[activeDeck.length - 1];
    let trueCard = lastCard.value;
    let claimedCard = cardNum[lastExpectedCard];

    if (trueCard !== claimedCard) {
        if (byOpponent) {
            logMessage("Opponent called BS! You lied! You take the pile.");
            playerDeck = playerDeck.concat(activeDeck);
        } else {
            logMessage("Correct! Opponent lied. They take the pile.");
            oppsDeck = oppsDeck.concat(activeDeck);
        }
    } else {
        if (byOpponent) {
            logMessage("Opponent called BS, but you told the truth. They take the pile.");
            oppsDeck = oppsDeck.concat(activeDeck);
        } else {
            logMessage("Wrong! You take the pile.");
            playerDeck = playerDeck.concat(activeDeck);
        }
    }

    activeDeck = [];
    expectedCard = 0;
    lastExpectedCard = 0;
    updateUI();

    checkFirstTurn();
}

function checkWin() {
    if (playerDeck.length === 0) {
        logMessage("You won the game! Congratulations!");
        setTimeout(closePopup, 4000);
    } else if (oppsDeck.length === 0) {
        logMessage("Opponent won the game. Better luck next time.");
        setTimeout(closePopup, 4000);
    }
}

function logMessage(message) {
    let messageBox = document.getElementById('message');
    messageBox.innerText += '\n' + message;
    messageBox.scrollTop = messageBox.scrollHeight;
}

function openPopup() {
    document.getElementById('bs-popup').style.display = 'flex';
    intitalizeDeck();
    dealCards();
    activeDeck = [];
    expectedCard = 0;
    lastExpectedCard = 0;
    updateUI();
}

function closePopup() {
    document.getElementById('bs-popup').style.display = 'none';


}

function checkFirstTurn() {
    let playerHasAceSpades = false;
    let oppHasAceSpades = false;

    for (let i = 0; i < playerDeck.length; i++) {
        if (playerDeck[i].value === 'A' && playerDeck[i].suit === 'Spades') {
            playerHasAceSpades = true;
        }
    }

    for (let i = 0; i < oppsDeck.length; i++) {
        if (oppsDeck[i].value === 'A' && oppsDeck[i].suit === 'Spades') {
            oppHasAceSpades = true;
        }
    }

    if (playerHasAceSpades) {
        playerTurn = true;
        logMessage("You have the Ace of Spades. You go first.");
    } else if (oppHasAceSpades) {
        playerTurn = false;
        logMessage("Opponent has the Ace of Spades. They go first.");
        setTimeout(oppMove, 1200);
    } else {
        let rand = Math.random();
        if (rand < 0.5) {
            playerTurn = true;
            logMessage("You go first.");
        } else {
            playerTurn = false;
            logMessage("Opponent goes first.");
            setTimeout(oppMove, 1200);
        }
    }


}

openPopup();
