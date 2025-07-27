import PromptSync from 'prompt-sync';
import Player from './classes/Player.js';
import Riddle from './classes/Riddle.js';
const prompt = PromptSync();
const serverUrl = 'http://localhost:4545'; 

const session = {
  token: null,
  username: null,
  role: 'guest'
};

async function startApp() {
  console.log("\n---------------------------")
console.log("Welcome to the trivia quiz!")
console.log("---------------------------")

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


async function mainMenu() {

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
const name = session.username ?? prompt("Please enter your name: ");
const myplayer = new Player(name)

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
const timecur =myplayer.getTotalTimeInSeconds()
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




async function createRiddle() {
  const name = prompt('Enter riddle name: ');
  const taskDescription = prompt('Enter description: ');
  const correctAnswer = prompt('Enter correct answer: ');

  const newRiddle = { name, taskDescription, correctAnswer };

  try {
    await fetch(`${serverUrl}/api/riddles`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...(session.token && { 'Authorization': `Bearer ${session.token}` }),
  },
  body: JSON.stringify(newRiddle)
});
    console.log('Riddle added successfully.');
  } catch (err) {
    console.error('Error adding riddle:', err);
  }
}


async function readAllRiddles() {
  try {
    const res = await fetch(`${serverUrl}/api/riddles`, {
     headers: {
  'Content-Type': 'application/json'
}

    });

    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

    const riddles = await res.json();

    console.log('\n--- All Riddles ---');
    riddles.forEach(r => {
      console.log(`ID: ${r.id}, Name: ${r.name}`);
      console.log(`Description: ${r.taskDescription}`);
      console.log(`Answer: ${r.correctAnswer}\n`);
    });
  } catch (err) {
    console.error('Error reading riddles:', err.message || err);
  }
}



async function updateExistingRiddle() {
  try {
    const riddles = await (await fetch(`${serverUrl}/api/riddles`)).json();
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

    await fetch(`${serverUrl}/api/riddles/${id}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    ...(session.token && { 'Authorization': `Bearer ${session.token}` }),
  },
  body: JSON.stringify({ name, taskDescription, correctAnswer }),
});


    console.log('Riddle updated successfully.');
  } catch (err) {
    console.error('Error updating riddle:', err);
  }
}


async function deleteExistingRiddle() {
  try {
    const idStr = prompt('Enter the ID of the riddle to delete: ');
    const id = Number(idStr);

    
    await fetch(`${serverUrl}/api/riddles/${id}`, {
  method: 'DELETE',
  headers: {
    ...(session.token && { 'Authorization': `Bearer ${session.token}` }),
  }
});


    console.log('Riddle deleted successfully.');
  } catch (err) {
    console.error('Error deleting riddle:', err);
  }
}



async function viewLeaderboard() {
  try {
    const players = await (await fetch(`${serverUrl}/api/players`)).json();

    for (let i = 0; i < players.length - 1; i++) {
      for (let j = 0; j < players.length - 1; j++) {
        if (players[j].lowestTime > players[j + 1].lowestTime) {
          const temp = players[j];
          players[j] = players[j + 1];
          players[j + 1] = temp;
        }
      }
    }

    console.log('\n--- Leaderboard ---');
    players.forEach((p, index) => {
      console.log(`${index + 1}. ${p.name} - ${p.lowestTime} seconds`);
    });
  } catch (err) {
    console.error('Error reading leaderboard:', err);
  }
}


async function signUp() {
  const name = prompt("Choose a username: ");
  const password = prompt("Choose a password: ");

  try {
    const res = await fetch(`${serverUrl}/api/players/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: name, password }) 
    });

    const data = await res.json();

    if (!res.ok) {
      console.log("Signup failed:", data.error || data.msg);
      return await startApp();
    }

    session.token = data.token;
    session.username = name;
    session.role = data.role || 'user';

    console.log("Signed up successfully as", name);

  } catch (err) {
    console.error("Signup error:", err);
    await startApp();
  }
}



async function logIn() {
  const name = prompt("Enter username: ");
  const password = prompt("Enter password: ");

  try {
    const res = await fetch(`${serverUrl}/api/players/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: name, password }) 
    });

    const data = await res.json();

    if (!res.ok) {
      console.log("Login failed:", data.error || data.msg);
      return await startApp();
    }

    session.token = data.token;
    session.username = name;
    session.role = data.role || 'user';

    console.log("Logged in as", name);

  } catch (err) {
    console.error("Login error:", err);
    await startApp();
  }
}



startApp();
