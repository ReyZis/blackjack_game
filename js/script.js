$('#myModal').modal()


let blackjack = {
    'you': {
        "scoreSpan": "#your-blackjack-result",
        "div": "#your-box",
        "score": 0
    },
    'dealer': {
        "scoreSpan": "#dealer-blackjack-result",
        "div": "#dealer-box",
        "score": 0
    },
    'cards': ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q'],
    "cardsMap": { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'Q': 10, 'J': 10 },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
};
const YOU = blackjack['you']
const DEALER = blackjack['dealer']

const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const lostSound = new Audio('sounds/aww.mp3');

document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);

function blackjackHit() {
    if (blackjack['isStand'] === false) {
        let card = randomCard();
        showCard(card, YOU);
        updateSore(card, YOU);
        showScore(YOU);
    }
}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjack['cards'][randomIndex];
}

function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function blackjackDeal() {
    if (blackjack['turnsOver'] === true) {
        blackjack['isStand'] = false;

        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

        for (let i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        };

        for (let i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        };

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector(YOU['scoreSpan']).textContent = YOU['score'];
        document.querySelector(YOU['scoreSpan']).style.color = 'white';

        document.querySelector(DEALER['scoreSpan']).textContent = DEALER['score'];
        document.querySelector(DEALER['scoreSpan']).style.color = 'white';

        document.querySelector('#blackjack-result').textContent = "Let's Play";
        document.querySelector('#blackjack-result').style.color = "white";

        blackjack['turnsOver'] = true;
    }
}

function updateSore(card, activePlayer) {
    if (card === 'A') {
        if (activePlayer['score'] <= 10) {
            activePlayer['score'] += 1
        } else {
            activePlayer['score'] += 1
        }
    } else {
        activePlayer['score'] += blackjack['cardsMap'][card];
    }
}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function dealerLogic() {
    blackjack['isStand'] = true;

    while (DEALER['score'] < 16 && blackjack['isStand'] === true) {
        let card = randomCard();
        showCard(card, DEALER);
        updateSore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }

    blackjack['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);
}

// compute winner and return who just won
// update the wins, draws, and losses
function computeWinner() {
    let winner;

    if (YOU['score'] <= 21) {
        if ((YOU['score'] > DEALER['score']) || (DEALER['score'] > 21)) {
            blackjack['wins']++;
            winner = YOU;

        } else if (YOU['score'] < DEALER['score']) {
            blackjack['losses']++;
            winner = DEALER;

        } else if (YOU['score'] === DEALER['score']) {
            blackjack['draws']++;
        }

    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        blackjack['losses']++;
        winner = DEALER;

    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjack['draws']++;

    }
    console.log(blackjack)
    return winner;
}

function showResult(winner) {
    let message, messgaeColor;

    if (blackjack['turnsOver'] === true) {

        if (winner === YOU) {
            document.querySelector('#wins').textContent = blackjack['wins'];
            message = 'You Won!';
            messgaeColor = 'green';
            winSound.play();
        } else if (winner === DEALER) {
            document.querySelector('#losses').textContent = blackjack['losses'];
            message = 'You Lost!';
            messgaeColor = 'red';
            lostSound.play();
        } else {
            document.querySelector('#draws').textContent = blackjack['draws'];
            message = 'You Drew!';
            messgaeColor = 'black';
        }

        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messgaeColor;
    }
}