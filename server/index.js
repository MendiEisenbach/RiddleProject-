import express from 'express';
import riddlesRoutes from './routes/riddlesRoutes.js';
import playersRoutes from './routes/playersRoutes.js';
import { connectToMongo } from './riddles/mongoService.js';


const server = express();
const port = 4545;

server.use(express.json());

server.use('/api/riddles', riddlesRoutes);
server.use('/api/players', playersRoutes);


const start = async () => {
  await connectToMongo();

  server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
};

start();
