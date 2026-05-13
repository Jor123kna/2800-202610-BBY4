const express = require('express');
const router = express.Router();
const Reply = require('../models/replies');
const { isLoggedIn } = require('../middleware/requireLogin');

// get all replies for a specific post
router.get('/post/:postId', async (req, res) => {
    try {
        const replies = await Reply.find({ post: req.params.postId })
            .populate('author', 'firstName lastName role')
            .sort({ createdAt: 1 });

        res.status(200).json({
            message: 'Replies retrieved',
            replies
        });

    } catch (err) {
        res.status(500).json({
            message: 'Error getting replies',
            error: err.message
        });
    }
});

// create a new reply
// author comes from session (not from form)
router.post('/', isLoggedIn, async (req, res) => {
    try {
        const { postId, content } = req.body;

        // Validate required fields
        if (!postId || !content || !content.trim()) {
            return res.status(400).json({
                message: 'postId and content are required'
            });
        }

        // Create the reply
        const reply = await Reply.create({
            post: postId,
            author: req.session.user.id,
            content: content.trim()
        });

        // Populate author info before sending back
        const populatedReply = await Reply.findById(reply._id)
            .populate('author', 'firstName lastName role');

        res.status(201).json({
            message: 'Reply created',
            reply: populatedReply
        });

    } catch (err) {
        res.status(500).json({
            message: 'Error creating reply',
            error: err.message
        });
    }
});

// delete a reply
router.delete('/:id', isLoggedIn, async (req, res) => {
    try {
        const reply = await Reply.findById(req.params.id);

        if (!reply) {
            return res.status(404).json({ message: 'Reply not found' });
        }

        // Only author can delete
        if (reply.author.toString() !== req.session.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Reply.findByIdAndDelete(req.params.id);
        res.json({ message: 'Reply deleted' });

    } catch (err) {
        res.status(500).json({
            message: 'Error deleting reply',
            error: err.message
        });
    }
});

module.exports = router;