const express = require('express');
const router = express.Router();
const Reply = require('../models/replies');
const Post = require('../models/posts');
const { isLoggedIn } = require('../middleware/requireLogin');

// --------------------
// Helper functions
// --------------------

/**
 * sendServerError
 * Helper to log an error and send a standardized 500 response.
 * @param {object} res - Express response object
 * @param {string} label - Log label for server console
 * @param {string} message - Message to send in the response
 * @param {Error} err - The caught error
 */
const sendServerError = (res, label, message, err) => {
    console.error(label, err);

    res.status(500).json({
        message,
        error: err.message
    });
};

/**
 * getRepliesToMyPosts
 * Retrieve posts authored by a user and replies to those posts by others.
 * @param {string} userId - User id to find posts for
 * @returns {Object} - { myPosts, repliesToMyPosts }
 */
const getRepliesToMyPosts = async (userId) => {
    const myPosts = await Post.find({ author: userId });
    const myPostIds = myPosts.map((post) => post._id);

    const repliesToMyPosts = await Reply.find({
        post: { $in: myPostIds },
        author: { $ne: userId }
    })
        .populate('author', 'firstName lastName role')
        .populate('post', 'title role')
        .sort({ createdAt: -1 });

    return { myPosts, repliesToMyPosts };
};

/**
 * buildMyPostsGroups
 * Group replies by each of the user's posts for notification display.
 * @param {Array} myPosts - Array of Post documents
 * @param {Array} repliesToMyPosts - Array of Reply documents
 * @returns {Array} - Groups of posts with their replies
 */
const buildMyPostsGroups = (myPosts, repliesToMyPosts) => {
    return myPosts.map((post) => {
        const replies = repliesToMyPosts.filter((reply) => {
            return reply.post._id.toString() === post._id.toString();
        });

        return {
            postId: post._id,
            postTitle: post.title,
            postRole: post.role,
            replies
        };
    }).filter((group) => group.replies.length > 0);
};

/**
 * getMyReplies
 * Fetch replies authored by the given user.
 * @param {string} userId - User id to find replies for
 * @returns {Array} - Array of Reply documents
 */
const getMyReplies = async (userId) => {
    return await Reply.find({ author: userId })
        .populate('author', 'firstName lastName role')
        .populate('post', 'title role author')
        .sort({ createdAt: -1 });
};

/**
 * buildMyRepliesGroups
 * Transform the user's replies into groups by the post they belong to,
 * excluding replies made to the user's own posts.
 * @param {Array} myReplies - Replies authored by user
 * @param {string} userId - Current user id
 * @returns {Array} - Grouped replies per post
 */
const buildMyRepliesGroups = (myReplies, userId) => {
    return myReplies
        .filter((reply) => {
            return reply.post && reply.post.author.toString() !== userId;
        })
        .map((reply) => {
            return {
                postId: reply.post._id,
                postTitle: reply.post.title,
                postRole: reply.post.role,
                replies: [reply]
            };
        });
};

/**
 * isMissingReplyContent
 * Check whether reply content is empty or whitespace only.
 * @param {string} content
 * @returns {boolean}
 */
const isMissingReplyContent = (content) => {
    return !content || !content.trim();
};

/**
 * findReplyOr404
 * Helper to find a reply by id and send 404 if not found.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {Promise<Reply|null>}
 */
const findReplyOr404 = async (req, res) => {
    const reply = await Reply.findById(req.params.id);

    if (!reply) {
        res.status(404).json({ message: 'Reply not found' });
        return null;
    }

    return reply;
};

/**
 * isReplyAuthor
 * Check whether given userId is the author of the reply.
 * @param {object} reply - Reply document
 * @param {string} userId - User id to check
 * @returns {boolean}
 */
const isReplyAuthor = (reply, userId) => {
    return reply.author.toString() === userId;
};

//Notification routes
/**
 * GET /replies/notifications
 * Return notifications for the logged-in user: replies to their posts
 * and their replies to others' posts.
 */
router.get('/notifications', isLoggedIn, async (req, res) => {
    try {
        const userId = req.session.user.id;

        const { myPosts, repliesToMyPosts } = await getRepliesToMyPosts(userId);
        const myPostsGroups = buildMyPostsGroups(myPosts, repliesToMyPosts);

        const myReplies = await getMyReplies(userId);
        const myRepliesGroups = buildMyRepliesGroups(myReplies, userId);

        res.json({
            myPosts: myPostsGroups,
            myReplies: myRepliesGroups
        });

    } catch (err) {
        sendServerError(
            res,
            'Notification replies error:',
            'Error loading notifications',
            err
        );
    }
});

/**
 * GET /replies/post/:postId
 * Retrieve all replies for a specific post id.
 */
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
        sendServerError(res, 'Get replies error:', 'Error getting replies', err);
    }
});

/**
 * POST /replies/
 * Create a new reply. Author is taken from session data.
 */
// create a new reply
// author comes from session (not from form)
router.post('/', isLoggedIn, async (req, res) => {
    try {
        const { postId, content } = req.body;

        if (!postId || isMissingReplyContent(content)) {
            return res.status(400).json({
                message: 'postId and content are required'
            });
        }

        const reply = await Reply.create({
            post: postId,
            author: req.session.user.id,
            content: content.trim()
        });

        const populatedReply = await Reply.findById(reply._id)
            .populate('author', 'firstName lastName role');

        res.status(201).json({
            message: 'Reply created',
            reply: populatedReply
        });

    } catch (err) {
        sendServerError(res, 'Create reply error:', 'Error creating reply', err);
    }
});

/**
 * DELETE /replies/:id
 * Delete a reply. Only the reply author can delete.
 */
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

/**
 * PUT /replies/:id
 * Edit a reply's content. Only the reply author can edit.
 */
// PUT /replies/:id - edit a reply (author only)
router.put('/:id', isLoggedIn, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { content } = req.body;

        if (isMissingReplyContent(content)) {
            return res.status(400).json({ message: 'Reply content cannot be empty' });
        }

        const reply = await findReplyOr404(req, res);
        if (!reply) return;

        if (!isReplyAuthor(reply, userId)) {
            return res.status(403).json({ message: 'You can only edit your own replies' });
        }

        reply.content = content.trim();
        reply.editedAt = new Date();
        await reply.save();

        const updatedReply = await Reply.findById(reply._id)
            .populate('author', 'firstName lastName');

        res.json({ message: 'Reply updated successfully', reply: updatedReply });

    } catch (err) {
        sendServerError(res, 'Edit reply error:', 'Error updating reply', err);
    }
});


module.exports = router;