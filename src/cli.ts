import readline from 'readline';
import seedrandom from 'seedrandom';
import { createDeck, shuffleDeck, dealCards, calculateHandValue, splitHand, doubleDown, checkPerfectPairs, check21Plus3, checkRoyalMatch, checkLuckyLadies, dealerDraw } from './main';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const rng = seedrandom('your-seed-here', { entropy: true, state: true });

function askQuestion(query: string): Promise<string> {
    return new Promise(resolve => rl.question(query, resolve));
}

async function playRound(balance: number): Promise<number> {
    const betSize = parseInt(await askQuestion('Enter your bet size: '), 10);
    if (isNaN(betSize) || betSize <= 0 || betSize > balance) {
        console.log('Invalid bet size. Please enter a valid amount.');
        return balance;
    }

    const sideBetAmount = parseInt(await askQuestion('Enter your side bet amount: '), 10);
    if (isNaN(sideBetAmount) || sideBetAmount < 0 || sideBetAmount > balance - betSize) {
        console.log('Invalid side bet amount. Please enter a valid amount.');
        return balance;
    }

    const deck = createDeck();
    const shuffledDeck = shuffleDeck(deck);
    let playerHand = dealCards(shuffledDeck, 2);
    const dealerHand = dealCards(shuffledDeck, 2);

    console.log('Player Hand:', playerHand);
    console.log('Dealer Hand:', dealerHand);

    console.log('Player Hand Value:', calculateHandValue(playerHand));
    console.log('Dealer Hand Value:', calculateHandValue(dealerHand));

    const splitResponse = await askQuestion('Do you want to split your hand? (yes/no): ');
    if (splitResponse.toLowerCase() === 'yes') {
        let [hand1, hand2] = splitHand(playerHand, shuffledDeck);
        console.log('Split Hands:', hand1, hand2);

        const doubleDownResponse1 = await askQuestion('Do you want to double down on hand 1? (yes/no): ');
        if (doubleDownResponse1.toLowerCase() === 'yes') {
            const result1 = doubleDown(hand1, shuffledDeck, balance);
            hand1 = result1.hand;
            balance = result1.balance;
            console.log('Doubled Hand 1:', hand1);
        }

        const doubleDownResponse2 = await askQuestion('Do you want to double down on hand 2? (yes/no): ');
        if (doubleDownResponse2.toLowerCase() === 'yes') {
            const result2 = doubleDown(hand2, shuffledDeck, balance);
            hand2 = result2.hand;
            balance = result2.balance;
            console.log('Doubled Hand 2:', hand2);
        }
    } else {
        const doubleDownResponse = await askQuestion('Do you want to double down? (yes/no): ');
        if (doubleDownResponse.toLowerCase() === 'yes') {
            const result = doubleDown(playerHand, shuffledDeck, balance);
            playerHand = result.hand;
            balance = result.balance;
            console.log('Doubled Hand:', playerHand);
        }
    }

    // Calculate final hand values and update balance
    const playerHandValue = calculateHandValue(playerHand);
    const dealerHandValue = calculateHandValue(dealerHand);

    console.log('Final Player Hand Value:', playerHandValue);
    console.log('Final Dealer Hand Value:', dealerHandValue);

    if (playerHandValue > dealerHandValue && playerHandValue <= 21 || dealerHandValue > 21) {
        balance += 10; // Example win amount
        console.log('You win! New balance:', balance);
    } else {
        balance -= 10; // Example loss amount
        console.log('You lose. New balance:', balance);
    }

    return balance;
}

async function main() {
    let balance = 100; // Starting balance

    while (true) {
        balance = await playRound(balance);

        const newGameResponse = await askQuestion('Do you want to play a new game? (yes/no): ');
        if (newGameResponse.toLowerCase() !== 'yes') {
            break;
        }
    }

    rl.close();
}

main();