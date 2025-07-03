import PromptSync from 'prompt-sync';
import Player from './classes/Player.js';
import Riddle from './classes/Riddle.js';
import { readFile } from './riddles/riddleService.js';

const prompt = PromptSync();
console.log("\n---------------------------")
console.log("Welcome to the trivia quiz!")
console.log("---------------------------")

const name = prompt("Please enter your name: ")
const myplayer = new Player(name)

const riddlesData = await readFile();
const riddles = riddlesData.map(r => new Riddle(r.id, r.name, r.taskDescription, r.correctAnswer));

console.log(`\nHi ${myplayer.name.name}, let's start!\n`);


const gameStart = Date.now();


for (const riddle of riddles) {
    await riddle.ask(prompt); 
}

const gameEnd = Date.now();
myplayer.recordTime(gameStart, gameEnd)

console.log(`\n${myplayer.name} You answered all the questions correctly!`);
myplayer.showStats()    


