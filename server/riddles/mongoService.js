import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

let riddlesCollection;

export const connectToMongo = async () => {
  await client.connect();
  const db = client.db('RiddlesGame');
  riddlesCollection = db.collection('Riddles');
  console.log('Connected to Mongo DB');
};

export const getRiddlesCollection = () => riddlesCollection;