import readline from 'readline';
import seedrandom from 'seedrandom';
import { createDeck, shuffleDeck, dealCards, calculateHandValue, splitHand, doubleDown, checkPerfectPairs, check21Plus3, checkRoyalMatch, checkLuckyLadies, dealerDraw } from './main.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const rng = seedrandom('your-seed-here', { entropy: true, state: true });

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function playRound(balance) {
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
    console.log('Shuffled Deck:', shuffledDeck);

    let playerHands = [dealCards(shuffledDeck, 2)];
    let dealerHand = dealCards(shuffledDeck, 2);

    console.log('Player Hand:', playerHands[0]);
    console.log('Dealer Hand:', dealerHand);

    console.log('Player Hand Value:', calculateHandValue(playerHands[0]));
    console.log('Dealer Hand Value:', calculateHandValue(dealerHand));

    // Check for side bets
    const sideBets = {
        perfectPairs: checkPerfectPairs(playerHands[0]),
        twentyOnePlusThree: check21Plus3(playerHands[0], dealerHand[0]),
        royalMatch: checkRoyalMatch(playerHands[0]),
        luckyLadies: checkLuckyLadies(playerHands[0])
    };

    for (const [bet, result] of Object.entries(sideBets)) {
        if (result) {
            console.log(`${bet}: ${result}`);
        }
    }

    let i = 0;
    while (i < playerHands.length) {
        let hand = playerHands[i];
        let action;
        do {
            action = await askQuestion(`Hand ${i + 1}: Do you want to hit, stand, or double down? (hit/stand/double): `);
            if (action.toLowerCase() === 'hit') {
                hand.push(shuffledDeck.shift());
                console.log(`Hand ${i + 1}:`, hand);
                console.log(`Hand ${i + 1} Value:`, calculateHandValue(hand));
            } else if (action.toLowerCase() === 'double') {
                const result = doubleDown(hand, shuffledDeck, balance);
                hand = result.hand;
                balance = result.balance;
                console.log(`Doubled Hand ${i + 1}:`, hand);
                console.log(`New balance: ${balance}`);
                break;
            }
        } while (action.toLowerCase() !== 'stand' && calculateHandValue(hand) < 21);

        playerHands[i] = hand;
        i++;
    }

    // Dealer draws to 17
    dealerHand = dealerDraw(shuffledDeck, dealerHand);
    console.log('Final Dealer Hand:', dealerHand);
    console.log('Final Dealer Hand Value:', calculateHandValue(dealerHand));

    // Calculate final hand values and update balance
    playerHands.forEach((hand, index) => {
        const playerHandValue = calculateHandValue(hand);
        const dealerHandValue = calculateHandValue(dealerHand);

        console.log(`Final Player Hand ${index + 1} Value:`, playerHandValue);

        if (playerHandValue > dealerHandValue && playerHandValue <= 21 || dealerHandValue > 21) {
            balance += betSize; // Win amount
            console.log(`You win on hand ${index + 1}! New balance:`, balance);
        } else {
            balance -= betSize; // Loss amount
            console.log(`You lose on hand ${index + 1}. New balance:`, balance);
        }
    });

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