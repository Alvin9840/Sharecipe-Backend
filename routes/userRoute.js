const express = require('express');
const User = require('../models/User');

const router = express.Router();

//get all user
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//get user by Id

// Create a new user
router.post('/', async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            email: req.body.email,
            image: req.body.image
        }

        const userRef = await User.findOneAndUpdate(data, data, {
            new: true,
            upsert: true,
            runValidators: true
        });
        const userRes = await userRef.save();
        res.status(201).json(userRes);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;