import promptSync from 'prompt-sync';
const prompt = promptSync();

import { signUp, logIn, session } from './auth.js';
import { mainMenu } from './menu.js';

async function startApp() {
  console.log("\n---------------------------");
  console.log("Welcome to the trivia quiz!");
  console.log("---------------------------");

  console.log("\n1. Sign up");
  console.log("2. Log in");
  console.log("3. Play as Guest");
  console.log("0. Exit");

  const choice = prompt("Choose an option: ");

  switch (choice) {
    case '1':
      await signUp();
      break;
    case '2':
      await logIn();
      break;
    case '3':
      console.log("Continuing as Guest...");
      session.role = 'guest';
      session.username = null;
      session.token = null;
      break;
    case '0':
      console.log("Goodbye!");
      process.exit(0);
    default:
      console.log("Invalid choice");
      return startApp();
  }

  await mainMenu();
}

startApp();
