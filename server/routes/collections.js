const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');
const auth = require('../middleware/auth');

// Get all collections for a user
router.get('/', auth, async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user.id })
      .populate('cards', 'title type category')
      .sort({ createdAt: -1 });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single collection
router.get('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    }).populate('cards');
    
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new collection
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, cards, isPublic } = req.body;

    const collection = new Collection({
      name,
      description,
      cards: cards || [],
      isPublic: isPublic || false,
      user: req.user.id
    });

    await collection.save();
    res.status(201).json(collection);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a collection
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, cards, isPublic } = req.body;

    const collection = await Collection.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    // Update fields
    if (name) collection.name = name;
    if (description !== undefined) collection.description = description;
    if (cards) collection.cards = cards;
    if (isPublic !== undefined) collection.isPublic = isPublic;

    await collection.save();
    res.json(collection);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a collection
router.delete('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add card to collection
router.post('/:id/cards', auth, async (req, res) => {
  try {
    const { cardId } = req.body;

    const collection = await Collection.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    if (!collection.cards.includes(cardId)) {
      collection.cards.push(cardId);
      await collection.save();
    }

    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove card from collection
router.delete('/:id/cards/:cardId', auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    collection.cards = collection.cards.filter(
      card => card.toString() !== req.params.cardId
    );
    await collection.save();

    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

