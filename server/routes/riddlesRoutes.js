import express from 'express';
import { readRiddles, addRiddle, updateRiddle, deleteRiddle } from '../riddles/riddleService.js';


const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const riddles = await readRiddles();
    res.json(riddles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read riddles', details: error.message });
  }
});



router.post('/', async (req, res) => {
  const { name, taskDescription, correctAnswer } = req.body;

  if (!name || !taskDescription || !correctAnswer) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await addRiddle({ name, taskDescription, correctAnswer });
    res.status(201).json({ msg: 'Riddle added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add riddle', details: error.message });
  }
});



router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { name, taskDescription, correctAnswer } = req.body;

  try {
    await updateRiddle(id, { name, taskDescription, correctAnswer });
    res.json({ msg: 'Riddle updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update riddle', details: error.message });
  }
});


router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  try {
    await deleteRiddle(id);
    res.json({ msg: 'Riddle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete riddle', details: error.message });
  }
});

export default router;