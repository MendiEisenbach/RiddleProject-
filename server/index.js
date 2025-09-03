import express from 'express';
import riddlesRoutes from './routes/riddlesRoutes.js';
import playersRoutes from './routes/playersRoutes.js';
import { connectToMongo } from './riddles/mongoService.js';
import cors from 'cors';


const server = express();
const port = 4545;
app.use(cors()); 
app.get('/test', (req, res) => {
  res.json({ message: 'CORS fonctionne !' });
});
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
