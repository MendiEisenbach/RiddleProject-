import fs from 'fs';

const riddlesPath = "riddles/db.txt";


export const readRiddles = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(riddlesPath, "utf8", (err, data) => {
      if (err) return reject(err);
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
  });
};


export const writeRiddles = (riddles) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(riddlesPath, JSON.stringify(riddles), 'utf8', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};



export const addRiddle = async (riddle) => {
  const riddles = await readRiddles();

  let maxId = 0;
  for (const currentRiddle of riddles) {
    if (currentRiddle.id > maxId) {
      maxId = currentRiddle.id;
    }
  }

  riddle.id = maxId + 1;
  riddles.push(riddle);
  await writeRiddles(riddles);
};



export const updateRiddle = async (id, updatedRiddle) => {
  const riddles = await readRiddles();

  let found = false;

  for (let i = 0; i < riddles.length; i++) {
    if (riddles[i].id === id) {
      riddles[i].name = updatedRiddle.name;
      riddles[i].taskDescription = updatedRiddle.taskDescription;
      riddles[i].correctAnswer = updatedRiddle.correctAnswer;
      found = true;
      break; 
    }
  }

  if (!found) {
    throw new Error('Riddle not found');
  }

  await writeRiddles(riddles);
};




export const deleteRiddle = async (id) => {
  const riddles = await readRiddles();

  const newRiddles = riddles.filter(riddle => riddle.id !== id);

  if (newRiddles.length === riddles.length) {
    throw new Error('Riddle not found');
  }

  await writeRiddles(newRiddles);
};



