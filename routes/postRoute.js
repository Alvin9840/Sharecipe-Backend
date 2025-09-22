const express = require('express');
const { create } = require('../models/User');

const router = express.Router();

//Get All posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

});

//Create a  new post
router.post('/', async (req, res) => {
    try {
        const data = {
            postText: req.body.postText,
            createdAt: req.body.createdAt,
            createdBy: req.body.createdBy,
            imageUrl: req.body.imageUrl
        }

        const userRef = await User.findOneAndUpdate(data, data, {
            new: true,
            upsert: true,
            runValidators: true
        });
        const postRes = await Post.create(data);
        res.status(201).json(postRes);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;