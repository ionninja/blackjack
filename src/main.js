import seedrandom from 'seedrandom';

// Initialize the RNG with a seed
const rng = seedrandom('your-seed-here', { entropy: true, state: true });

// Function to shuffle a deck of cards using MT19937
export function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// Function to create a new deck of cards
export function createDeck(numDecks = 5) {
    const suits = ['H', 'D', 'C', 'S'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let deck = [];

    for (let i = 0; i < numDecks; i++) {
        for (let suit of suits) {
            for (let value of values) {
                deck.push(value + suit);
            }
        }
    }

    return deck;
}

// Function to deal cards to a player
export function dealCards(deck, numCards) {
    return deck.splice(0, numCards);
}

// Function to calculate the value of a hand
export function calculateHandValue(hand) {
    let value = 0;
    let numAces = 0;

    for (let card of hand) {
        let cardValue = card.slice(0, -1);
        if (['J', 'Q', 'K'].includes(cardValue)) {
            value += 10;
        } else if (cardValue === 'A') {
            numAces += 1;
            value += 11;
        } else {
            value += parseInt(cardValue);
        }
    }

    while (value > 21 && numAces > 0) {
        value -= 10;
        numAces -= 1;
    }

    return value;
}

// Function to handle splitting a hand
export function splitHand(hand, deck) {
    const hands = [];

    if (hand.length === 2 && hand[0].slice(0, -1) === hand[1].slice(0, -1)) {
        const hand1 = [hand[0]];
        const hand2 = [hand[1]];

        if (deck.length >= 2) {
            hand1.push(deck.shift());
            hand2.push(deck.shift());
        } else {
            console.error("Not enough cards in the deck to split hands.");
            return [hand];
        }

        hands.push(hand1, hand2);
    } else {
        hands.push(hand);
    }

    return hands;
}

// Function to handle doubling down
export function doubleDown(hand, deck, balance) {
    const doubleDownCost = 10; // Assuming double down costs 10 units
    if (balance >= doubleDownCost) {
        hand.push(deck.shift());
        return { hand, balance: balance - doubleDownCost };
    } else {
        console.error("Not enough balance to double down.");
        return { hand, balance };
    }
}

// Function to check for Perfect Pairs side bet
export function checkPerfectPairs(playerHand) {
    if (playerHand.length === 2) {
        const [card1, card2] = playerHand;
        const rank1 = card1.slice(0, -1);
        const rank2 = card2.slice(0, -1);
        const suit1 = card1.slice(-1);
        const suit2 = card2.slice(-1);

        if (rank1 === rank2) {
            if (suit1 === suit2) {
                return 'Perfect Pair';
            } else if ((suit1 === 'H' || suit1 === 'D') && (suit2 === 'H' || suit2 === 'D') ||
                       (suit1 === 'C' || suit1 === 'S') && (suit2 === 'C' || suit2 === 'S')) {
                return 'Colored Pair';
            } else {
                return 'Mixed Pair';
            }
        }
    }
    return null;
}

// Function to check for 21+3 side bet
export function check21Plus3(playerHand, dealerUpCard) {
    if (playerHand.length === 2) {
        const combinedHand = [...playerHand, dealerUpCard];
        const values = combinedHand.map(card => card.slice(0, -1));
        const suits = combinedHand.map(card => card.slice(-1));

        const isFlush = new Set(suits).size === 1;
        const isStraight = values.sort().join('') === 'A23456789TJQK'.slice(0, 3) ||
                           values.sort().join('') === '23456789TJQKA'.slice(1, 4);
        const isThreeOfAKind = new Set(values).size === 1;

        if (isFlush && isStraight) {
            return 'Straight Flush';
        } else if (isThreeOfAKind) {
            return 'Three of a Kind';
        } else if (isStraight) {
            return 'Straight';
        } else if (isFlush) {
            return 'Flush';
        }
    }
    return null;
}

// Function to check for Royal Match side bet
export function checkRoyalMatch(playerHand) {
    if (playerHand.length === 2) {
        const [card1, card2] = playerHand;
        const rank1 = card1.slice(0, -1);
        const rank2 = card2.slice(0, -1);
        const suit1 = card1.slice(-1);
        const suit2 = card2.slice(-1);

        if (suit1 === suit2) {
            if ((rank1 === 'K' && rank2 === 'Q') || (rank1 === 'Q' && rank2 === 'K')) {
                return 'Royal Match';
            } else {
                return 'Easy Match';
            }
        }
    }
    return null;
}

// Function to check for Lucky Ladies side bet
export function checkLuckyLadies(playerHand) {
    if (playerHand.length === 2) {
        const [card1, card2] = playerHand;
        const rank1 = card1.slice(0, -1);
        const rank2 = card2.slice(0, -1);
        const suit1 = card1.slice(-1);
        const suit2 = card2.slice(-1);

        const value1 = rank1 === 'A' ? 11 : ['J', 'Q', 'K'].includes(rank1) ? 10 : parseInt(rank1);
        const value2 = rank2 === 'A' ? 11 : ['J', 'Q', 'K'].includes(rank2) ? 10 : parseInt(rank2);

        if (value1 + value2 === 20) {
            if (rank1 === rank2 && suit1 === suit2) {
                return 'Matched 20';
            } else if (suit1 === suit2) {
                return 'Suited 20';
            } else {
                return 'Unsuited 20';
            }
        }
    }
    return null;
}

// Function to handle dealer's actions
export function dealerDraw(deck, dealerHand) {
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(deck.shift());
    }
    return dealerHand;
}

// Example usage
const deck = createDeck();
const shuffledDeck = shuffleDeck(deck);
console.log('Shuffled Deck:', shuffledDeck);

let playerHand = dealCards(shuffledDeck, 2);
let dealerHand = dealCards(shuffledDeck, 2);

console.log('Player Hand:', playerHand);
console.log('Dealer Hand:', dealerHand);

console.log('Player Hand Value:', calculateHandValue(playerHand));
console.log('Dealer Hand Value:', calculateHandValue(dealerHand));

// Handle split
const [hand1, hand2] = splitHand(playerHand, shuffledDeck);
console.log('Split Hands:', hand1, hand2);

// Handle double down
const doubledHand = doubleDown(playerHand, shuffledDeck);
console.log('Doubled Hand:', doubledHand);

// Function to handle insurance
export function takeInsurance(dealerHand) {
    const dealerUpCard = dealerHand[0];
    return dealerUpCard.slice(0, -1) === 'A';
}

// Handle insurance
const insuranceAvailable = takeInsurance(dealerHand);
console.log('Insurance Available:', insuranceAvailable);

// Handle side bets
function placeSideBets(playerHand, dealerHand) {
    return {
        perfectPairs: checkPerfectPairs(playerHand),
        twentyOnePlusThree: check21Plus3(playerHand, dealerHand[0]),
        royalMatch: checkRoyalMatch(playerHand),
        luckyLadies: checkLuckyLadies(playerHand)
    };
}

const sideBets = placeSideBets(playerHand, dealerHand);
console.log('Side Bets:', sideBets);