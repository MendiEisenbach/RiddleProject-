import promptSync from 'prompt-sync';
const prompt = promptSync();

import { session } from './auth.js';

const serverUrl = 'http://localhost:4545';

export async function createRiddle() {
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

export async function readAllRiddles() {
  try {
    const res = await fetch(`${serverUrl}/api/riddles`, {
      headers: { 'Content-Type': 'application/json' }
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

export async function updateExistingRiddle() {
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

export async function deleteExistingRiddle() {
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
