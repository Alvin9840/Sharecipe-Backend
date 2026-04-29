const express = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');


const router = express.Router();


//Create New Comment
router.post('/', async (req, res) => {
    try {
        const post = await Post.findById(req.body.post);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const commentRes = await Comment.create(req.body);
        post.comments.push(commentRes._id);
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// Delete Route 
router.delete("/:commentId", async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId)
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        await Post.findByIdAndUpdate(comment.post, {
            $pull: { comments: comment._id }
        });

        const commentDeleteResp = await Comment.findByIdAndDelete(commentId)
        res.status(200).json(commentDeleteResp);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router;
