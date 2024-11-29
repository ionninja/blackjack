import readline from 'readline';
import { registerStaff } from './src/auth.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

(async () => {
    try {
        const username = await askQuestion('Enter username: ');
        const password = await askQuestion('Enter password: ');
        const staff = await registerStaff(username, password);
        console.log('Registered Staff:', staff);
    } catch (error) {
        console.error('Error registering staff:', error);
    } finally {
        rl.close();
    }
})();