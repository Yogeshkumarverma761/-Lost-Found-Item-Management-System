const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { protect } = require('../middleware/authMiddleware');

// @desc    Add new item
// @route   POST /api/items
router.post('/', protect, async (req, res) => {
    const { itemName, description, type, location, date, contactInfo } = req.body;

    try {
        const item = new Item({
            itemName,
            description,
            type,
            location,
            date,
            contactInfo,
            userId: req.user._id
        });

        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get all items
// @route   GET /api/items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find({}).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Search items
// @route   GET /api/items/search
router.get('/search', async (req, res) => {
    const { name } = req.query;
    try {
        const items = await Item.find({
            itemName: { $regex: name, $options: 'i' }
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get item by ID
// @route   GET /api/items/:id
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update item
// @route   PUT /api/items/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (item) {
            // Check if user owns the item
            if (item.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'User not authorized to update this item' });
            }

            item.itemName = req.body.itemName || item.itemName;
            item.description = req.body.description || item.description;
            item.type = req.body.type || item.type;
            item.location = req.body.location || item.location;
            item.date = req.body.date || item.date;
            item.contactInfo = req.body.contactInfo || item.contactInfo;

            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete item
// @route   DELETE /api/items/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (item) {
            // Check if user owns the item
            if (item.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'User not authorized to delete this item' });
            }

            await Item.deleteOne({ _id: req.params.id });
            res.json({ message: 'Item removed' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
