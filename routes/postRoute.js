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
        res.status(500).json({ message: err.message });
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
        const post = await Post.findById(postId);
        if (!post.likes) {
            const updatePost = await Post.findByIdAndUpdate(postId, { likes: [] },
                {
                    upsert: true,
                    runValidators: true
                }
            );
            await updatePost.save();
        }
        const updatedPost = await Post.findById(postId);
        data.isLike ? updatedPost.likes.push(data.userId) :
            updatedPost.likes.pop(data.userId);

        const result = await updatedPost.save()
        res.status(201).json(result);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;