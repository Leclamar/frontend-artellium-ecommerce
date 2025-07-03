const express = require('express');
const router = express.Router();
const Commission = require('../models/Commission');

router.get('/', async (req, res) => {
  try {
    const commissions = await Commission.find();
    res.json(commissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const commission = await Commission.findById(req.params.id);
    if (!commission) return res.status(404).json({ message: 'Commission not found' });
    res.json(commission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newCommission = new Commission(req.body);
    await newCommission.save();
    res.status(201).json(newCommission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedCommission = await Commission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCommission) return res.status(404).json({ message: 'Commission not found' });
    res.json(updatedCommission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedCommission = await Commission.findByIdAndDelete(req.params.id);
    if (!deletedCommission) return res.status(404).json({ message: 'Commission not found' });
    res.json({ message: 'Commission deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;