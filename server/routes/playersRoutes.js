import express from 'express';
import {
  readPlayers,
  savePlayerTime,
  registerPlayer,
  loginPlayer,
  verifyToken
} from '../players/playersService.js';

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

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required' });

  try {
    const { token, role } = await registerPlayer(username, password);
    res.status(201).json({ msg: 'Signup successful', token, role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const token = await loginPlayer(username, password);
    res.json({ token });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});



export default router;
