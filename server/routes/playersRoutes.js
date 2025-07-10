import express from 'express';
import { readPlayers, savePlayerTime } from '../players/playersService.js';

const router = express.Router();



router.get('/', async (req, res) => {
  try {
    const players = await readPlayers();
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read players', details: error.message });
  }
});

router.post('/', async (req, res) => {
  const { name, time } = req.body;

  if (!name || typeof time !== 'number') {
    return res.status(400).json({ error: 'Missing or invalid name/time' });
  }

  try {
    await savePlayerTime(name, time);
    res.status(201).json({ msg: 'Player time saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save player time', details: error.message });
  }
});

export default router;
