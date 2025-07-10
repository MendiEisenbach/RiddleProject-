import PromptSync from 'prompt-sync';
import Player from './classes/Player.js';
import Riddle from './classes/Riddle.js';
import { readRiddles, addRiddle, updateRiddle, deleteRiddle } from '../riddles/riddleService.js';
import { readPlayers, findPlayerByName, savePlayerTime } from '../players/playersService.js';


const prompt = PromptSync();


async function mainMenu() {

console.log("\n---------------------------")
console.log("Welcome to the trivia quiz!")
console.log("---------------------------")

  while (true) {
    console.log('\n--- Main Menu ---');
    console.log('1. Play the game');
    console.log('2. Create a new riddle');
    console.log('3. Read all riddles');
    console.log('4. Update an existing riddle');
    console.log('5. Delete a riddle');
    console.log('6. View leaderboard');
    console.log('0. Exit');
    const choice = prompt('Choose an option: ');

    switch (choice) {
      case '1':
        await playGame();
        break;
      case '2':
        await createRiddle();
        break;
      case '3':
        await readAllRiddles();
        break;
      case '4':
        await updateExistingRiddle();
        break;
      case '5':
        await deleteExistingRiddle();
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



async function playGame() {
const name = prompt("Please enter your name: ")
const myplayer = new Player(name)

try {
  const players = await readPlayers(); 

  const existingPlayer = findPlayerByName(players, name);

  if (existingPlayer) {
    console.log(`Welcome back, ${name}! Your best time is ${existingPlayer.lowestTime} seconds.`);
  } else {
    console.log(`Welcome, ${name}! This is your first time playing.`);
  }

} catch (err) {
  console.error("error reading player data:", err);
}

try {
  const riddlesData = await readRiddles();
  const riddles = riddlesData.map(r => new Riddle(r.id, r.name, r.taskDescription, r.correctAnswer));

  console.log(`\nHi ${myplayer.name}, let's start!\n`);


  for (const riddle of riddles) {
    const gameStart = Date.now();
    riddle.ask(prompt);
    const gameEnd = Date.now();
      myplayer.recordTime(gameStart, gameEnd);

}



  console.log(`\n${myplayer.name}, you answered all the questions correctly!`);
  myplayer.showStats();

  await savePlayerTime(name, myplayer.getTotalTimeInSeconds());

} catch (err) {
  console.error("error during the game:", err);
}}


async function createRiddle() {
  const name = prompt('Enter riddle name: ');
  const taskDescription = prompt('Enter description: ');
  const correctAnswer = prompt('Enter correct answer: ');

  const newRiddle = {
    name : name,
    taskDescription : taskDescription,
    correctAnswer : correctAnswer
  };

  try {
    await addRiddle(newRiddle);
    console.log('Riddle added successfully.');
  } catch (err) {
    console.error('Error adding riddle:', err);
  }
}


async function readAllRiddles() {
  try {
    const riddles = await readRiddles();
    console.log('\n--- All Riddles ---');
    riddles.forEach(r => {
      console.log(`ID: ${r.id}, Name: ${r.name}`);
      console.log(`Description: ${r.taskDescription}`);
      console.log(`Answer: ${r.correctAnswer}\n`);
    });
  } catch (err) {
    console.error('Error reading riddles:', err);
  }
}


async function updateExistingRiddle() {
  try {
    const riddles = await readRiddles();
    const idStr = prompt('Enter the ID of the riddle to update: ');
    const id = Number(idStr);
    const riddle = riddles.find(r => r.id === id);

    if (!riddle) {
      console.log('Riddle not found.');
      return;
    }

    const name = prompt(`Enter new name (${riddle.name}): `) || riddle.name;
    const taskDescription = prompt(`Enter new description (${riddle.taskDescription}): `) || riddle.taskDescription;
    const correctAnswer = prompt(`Enter new correct answer (${riddle.correctAnswer}): `) || riddle.correctAnswer;

    await updateRiddle(id, { name, taskDescription, correctAnswer });
    console.log('Riddle updated successfully.');
  } catch (err) {
    console.error('Error updating riddle:', err);
  }
}


async function deleteExistingRiddle() {
  try {
    const idStr = prompt('Enter the ID of the riddle to delete: ');
    const id = Number(idStr);

    await deleteRiddle(id);
    console.log('Riddle deleted successfully.');
  } catch (err) {
    console.error('Error deleting riddle:', err);
  }
}



async function viewLeaderboard() {
  try {
    const players = await readPlayers();

    for (let i = 0; i < players.length - 1; i++) {
      for (let j = 0; j < players.length - 1; j++) {
        if (players[j].lowestTime > players[j + 1].lowestTime) {

          const temp = players[j];
          players[j] = players[j + 1];
          players[j + 1] = temp;
        }
      }
    }

    console.log('\n--- Leaderboard --');
    players.forEach((p, index) => {
      console.log(`${index + 1}. ${p.name} - ${p.lowestTime} seconds`);
    });
  } catch (err) {
    console.error('Error reading leaderboard:', err);
  }
}


mainMenu();