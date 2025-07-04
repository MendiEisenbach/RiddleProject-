import PromptSync from 'prompt-sync';
import Player from './classes/Player.js';
import Riddle from './classes/Riddle.js';
import { readFile } from './riddles/riddleService.js';
import { readPlayers, findPlayerByName, savePlayerTime } from './players/playersService.js';


const prompt = PromptSync();
console.log("\n---------------------------")
console.log("Welcome to the trivia quiz!")
console.log("---------------------------")

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
  const riddlesData = await readFile();
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
}