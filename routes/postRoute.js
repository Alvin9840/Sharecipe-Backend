const express = require('express');
const Post = require('../models/Post');

const router = express.Router();

//Get All Posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('createdBy')
            .populate('likes')
            .populate({
                path: 'comments',
                populate: {
                    path: 'createdBy',
                    model: 'user'
                }
            })
            .sort({ createdAt: -1 });
        res.json(posts)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

});

//Created New Post
router.post('/', async (req, res) => {
    try {
        const data = {
            postText: req.body.postText,
            createdAt: req.body.createdAt,
            createdBy: req.body.createdBy,
            imageUrl: req.body.imageUrl
        }

        const postRes = await Post.create(data);
        res.status(201).json(postRes);

    } catch (err) {
        res.status(400).json({ 
            message: err.message,
            errors: err.errors
        });
    }
});

//Like/ Dislike a Post
router.put('/like/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const data = {
            userId: req.body.userId,
            isLike: req.body.isLike
        }

        if (!data.userId) {
            return res.status(400).json({ message: 'userId is required' });
        }

        const update = data.isLike
            ? { $addToSet: { likes: data.userId } }
            : { $pull: { likes: data.userId } };

        const result = await Post.findByIdAndUpdate(postId, update, {
            new: true,
            runValidators: true
        });

        if (!result) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(result);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
