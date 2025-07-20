import { getRiddlesCollection } from './mongoService.js';


export const readRiddles = async () => {
  return await getRiddlesCollection().find().toArray();
};



export const addRiddle = async (riddle) => {
  const riddles = await readRiddles();

  let maxId = 0;
  for (const r of riddles) {
    if (r.id > maxId) {
      maxId = r.id;
    }
  }

  riddle.id = maxId + 1;
  const result = await getRiddlesCollection().insertOne(riddle);
  return result.insertedId; 
};



export const updateRiddle = async (id, updatedRiddle) => {
  const result = await getRiddlesCollection().updateOne({ id }, {
    $set: {
        name: updatedRiddle.name,
        taskDescription: updatedRiddle.taskDescription,
        correctAnswer: updatedRiddle.correctAnswer
      }
    }
  )
    if (result.matchedCount === 0) {
    throw new Error('Riddle not found');
  }
}



export const deleteRiddle = async (id) => {
  const result = await getRiddlesCollection().deleteOne({ id });

  if (result.deletedCount === 0) {
    throw new Error('Riddle not found');
  }
}

