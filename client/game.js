import promptSync from 'prompt-sync';
const prompt = promptSync();

import { session } from './auth.js';
import Player from './classes/Player.js';
import Riddle from './classes/Riddle.js';

const serverUrl = 'https://riddleproject.onrender.com';

export async function playGame() {
  const name = session.username ?? prompt("Please enter your name: ");
  const myplayer = new Player(name);

  let players = [];
  try {
    const response = await fetch(`${serverUrl}/api/players`);
    const json = await response.json();
    players = json.data || json;
  } catch (err) {
    console.error("Error fetching players:", err);
  }

  const existingPlayer = players.find(p => p.name.toLowerCase() === name.toLowerCase());

  if (existingPlayer) {
    console.log(`Welcome back, ${name}! Your best time is ${existingPlayer.lowestTime} seconds.`);
  } else {
    console.log(`Welcome, ${name}! This is your first time playing.`);
  }

  let riddlesData = [];
  try {
    const res = await fetch(`${serverUrl}/api/riddles`, {
      headers: {
        ...(session.token && { 'Authorization': `Bearer ${session.token}` })
      }
    });

    const data = await res.json();

    if (!res.ok) {
      console.log("Failed to fetch riddles:", data.error || 'Unknown error');
      return;
    }

    riddlesData = data;
  } catch (err) {
    console.error("Error fetching riddles:", err.message);
    return;
  }

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

  const timecur = myplayer.getTotalTimeInSeconds();

  try {
    await fetch(`${serverUrl}/api/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        time: timecur
      })
    });
  } catch (err) {
    console.error("Error saving player time:", err);
  }
}

export async function viewLeaderboard() {
  try {
    const players = await (await fetch(`${serverUrl}/api/players`)).json();

    players.sort((a, b) => a.lowestTime - b.lowestTime);

    console.log('\n--- Leaderboard ---');
    players.forEach((p, index) => {
      console.log(`${index + 1}. ${p.name} - ${p.lowestTime} seconds`);
    });
  } catch (err) {
    console.error('Error reading leaderboard:', err);
  }
}
