import PromptSync from 'prompt-sync';
import Player from './classes/Player.js';
import Riddle from './classes/Riddle.js';
import AllRiddles from './riddles/AllRiddles.js';

const prompt = PromptSync();
console.log("\n---------------------------")
console.log("Welcome to the trivia quiz!")
console.log("---------------------------")

const name = prompt("Please enter your name: ")

const myplayer = new Player(name)

for (let oneriddle of AllRiddles) {
    const startTime = Date.now();

    const myriddle = new Riddle(
        oneriddle.id,
        oneriddle.name,
        oneriddle.taskDescription,
        oneriddle.correctAnswer
    );

    myriddle.ask(prompt)
    const endTime = Date.now();

    myplayer.recordTime(startTime, endTime)
}

console.log(`\n${myplayer.name} You answered all the questions correctly!`);
myplayer.showStats()














