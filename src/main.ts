import seedrandom from 'seedrandom';

// Declare `rng` once
const rng = seedrandom('your-seed-here', { entropy: true, state: true });

// Example usage of `rng`
export function getRandomNumber(): number {
  return rng();
}

// Function to shuffle a deck of cards using MT19937
export function shuffleDeck(deck: string[]): string[] {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// Function to create a new deck of cards
export function createDeck(numDecks = 5): string[] {
    const suits = ['H', 'D', 'C', 'S'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let deck: string[] = [];

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
export function dealCards(deck: string[], numCards: number): string[] {
    return deck.splice(0, numCards);
}

// Function to calculate the value of a hand
export function calculateHandValue(hand: string[]): number {
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
export function splitHand(hand: string[], deck: string[]): string[][] {
    const hands: string[][] = [];

    if (hand.length === 2 && hand[0].slice(0, -1) === hand[1].slice(0, -1)) {
        const hand1 = [hand[0]];
        const hand2 = [hand[1]];

        if (deck.length >= 2) {
            hand1.push(deck.shift()!);
            hand2.push(deck.shift()!);
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

// Define types for the functions
type Card = string;
type Hand = string[];
type Deck = string[];
type Balance = number;

interface DoubleDownResult {
  hand: Hand;
  balance: Balance;
}

// Function to handle doubling down
export function doubleDown(hand: Hand, deck: Deck, balance: Balance): DoubleDownResult {
  const doubleDownCost = 10; // Assuming double down costs 10 units
  if (balance >= doubleDownCost) {
    hand.push(deck.shift()!);
    return { hand, balance: balance - doubleDownCost };
  } else {
    console.error("Not enough balance to double down.");
    return { hand, balance };
  }
}

// Function to check for Perfect Pairs side bet
export function checkPerfectPairs(playerHand: Hand): string | null {
  if (playerHand.length === 2) {
    const [card1, card2] = playerHand;
    const rank1 = card1.slice(0, -1);
    const rank2 = card2.slice(0, -1);
    const suit1 = card1.slice(-1);
    const suit2 = card2.slice(-1);

    if (rank1 === rank2) {
      if (suit1 === suit2) {
        return 'Perfect Pair';
      } else if (
        (suit1 === 'H' || suit1 === 'D') && (suit2 === 'H' || suit2 === 'D') ||
        (suit1 === 'C' || suit1 === 'S') && (suit2 === 'C' || suit2 === 'S')
      ) {
        return 'Colored Pair';
      } else {
        return 'Mixed Pair';
      }
    }
  }
  return null;
}

// Function to handle dealer's actions
export function dealerDraw(deck: string[], dealerHand: string[]): string[] {
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(deck.shift()!);
    }
    return dealerHand;
}

// Example implementation of check21Plus3
export function check21Plus3(hand: string[]): boolean {
  // Implement your logic here
  // For example, check if the hand contains a combination that sums to 21 or includes a 3
  const handValue = hand.reduce((sum, card) => sum + parseInt(card, 10), 0);
  return handValue === 21 || hand.includes('3');
}

// Example implementation of checkRoyalMatch
export function checkRoyalMatch(hand: string[]): boolean {
  // Implement your logic here
  // For example, check if the hand contains a royal match (e.g., King and Queen of the same suit)
  const suits = hand.map(card => card.slice(-1));
  const values = hand.map(card => card.slice(0, -1));
  return values.includes('K') && values.includes('Q') && suits[values.indexOf('K')] === suits[values.indexOf('Q')];
}

// Example implementation of checkLuckyLadies
export function checkLuckyLadies(hand: string[]): boolean {
  // Implement your logic here
  // For example, check if the hand contains two Queens of Hearts
  const values = hand.map(card => card.slice(0, -1));
  const suits = hand.map(card => card.slice(-1));
  return values.filter(value => value === 'Q').length === 2 && suits.every(suit => suit === 'H');
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
const doubledHand = doubleDown(playerHand, shuffledDeck, 100); // Ensure you pass the balance as the third argument
console.log('Doubled Hand:', doubledHand);

// Function to handle insurance
export function takeInsurance(dealerHand: string[]): boolean {
    const dealerUpCard = dealerHand[0];
    return dealerUpCard.slice(0, -1) === 'A';
}

// Handle insurance
const insuranceAvailable = takeInsurance(dealerHand);
console.log('Insurance Available:', insuranceAvailable);

// Handle side bets
function placeSideBets(playerHand: string[], dealerHand: string[]): object {
    return {
        perfectPairs: checkPerfectPairs(playerHand),
        twentyOnePlusThree: check21Plus3(playerHand),
        royalMatch: checkRoyalMatch(playerHand),
        luckyLadies: checkLuckyLadies(playerHand)
    };
}

const sideBets = placeSideBets(playerHand, dealerHand);
console.log('Side Bets:', sideBets);