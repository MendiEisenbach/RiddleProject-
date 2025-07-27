import promptSync from 'prompt-sync';
const prompt = promptSync();

import { session } from './auth.js';
import {
  createRiddle,
  readAllRiddles,
  updateExistingRiddle,
  deleteExistingRiddle
} from './riddles.js';

import { playGame, viewLeaderboard } from './game.js';

export async function mainMenu() {
  while (true) {
    console.log(`\n--- Main Menu (${session.role}) ---`);
    console.log('1. Play the game');

    if (session.role !== 'guest') {
      console.log('2. Create a new riddle');
      console.log('3. Read all riddles');
    }

    if (session.role === 'admin') {
      console.log('4. Update an existing riddle');
      console.log('5. Delete a riddle');
    }

    console.log('6. View leaderboard');
    console.log('0. Exit');

    const choice = prompt('Choose an option: ');

    switch (choice) {
      case '1':
        await playGame();
        break;
      case '2':
        if (session.role !== 'guest') await createRiddle();
        else console.log('Unauthorized');
        break;
      case '3':
        if (session.role !== 'guest') await readAllRiddles();
        else console.log('Unauthorized');
        break;
      case '4':
        if (session.role === 'admin') await updateExistingRiddle();
        else console.log('Unauthorized');
        break;
      case '5':
        if (session.role === 'admin') await deleteExistingRiddle();
        else console.log('Unauthorized');
        break;
      case '6':
        await viewLeaderboard();
        break;
      case '0':
        console.log('Goodbye!');
        process.exit(0);
      default:
        console.log('Invalid choice, please try again.');
    }
  }
}
