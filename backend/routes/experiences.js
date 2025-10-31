const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');

// GET /experiences - Get all experiences
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find().select('-slots');
    res.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /experiences/:id - Get experience details
router.get('/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    res.json(experience);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /experiences - Create new experience
router.post('/', async (req, res) => {
  try {
    const newExperience = new Experience({
      ...req.body,
      tags: req.body.tags.split(',').map(tag => tag.trim()),
      slots: []
    });
    const savedExperience = await newExperience.save();
    res.status(201).json(savedExperience);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /experiences/:id - Update experience
router.put('/:id', async (req, res) => {
  try {
    const updatedExperience = await Experience.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        tags: req.body.tags.split(',').map(tag => tag.trim())
      },
      { new: true }
    );
    if (!updatedExperience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    res.json(updatedExperience);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /experiences/:id - Delete experience
router.delete('/:id', async (req, res) => {
  try {
    const deletedExperience = await Experience.findByIdAndDelete(req.params.id);
    if (!deletedExperience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
