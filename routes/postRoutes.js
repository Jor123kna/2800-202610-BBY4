const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const { isLoggedIn } = require("../middleware/requireLogin");

const createPostEntry = async ({
  author,
  title,
  content,
  neighbourhood,
  role,
  aigenerated = false,
}) => {
  return Post.create({
    author,
    title,
    content,
    neighbourhood,
    role,
    aigenerated,
  });
};

// POST /posts - create a new post
// author comes from session (not from form)
router.post("/", isLoggedIn, async (req, res) => {
  try {
    const post = await createPostEntry({
      author: req.session.user.id, // from session
      title: req.body.title, // from form
      content: req.body.content, // from form
      neighbourhood: req.body.neighbourhood, // from form
      role: req.body.role, // from form
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /posts/autofill - create a new post from autofill data
router.post("/autofill", isLoggedIn, async (req, res) => {
  try {
    const post = await createPostEntry({
      author: req.session.user.id,
      title: req.body.title || "Community update",
      content: req.body.content || "",
      neighbourhood: req.body.neighbourhood || "",
      role: req.body.role || "in-need",
      aigenerated: true,
    });

    res.status(201).json({
      message: "Auto-filled post created successfully",
      post,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /posts - get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "author",
      "firstName lastName role",
    );

    res.status(200).json({
      message: "Posts retrieved",
      posts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /posts/:id - delete a post
router.delete("/:id", isLoggedIn, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // only author or admin can delete
    if (
      post.author.toString() !== req.session.user.id &&
      req.session.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /posts/mine - get posts created by the logged-in user
router.get("/mine", isLoggedIn, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.session.user.id })
      .populate("author", "firstName lastName role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "User posts retrieved",
      posts,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error getting user posts",
      error: err.message,
    });
  }
});

// GET /posts/:id - get a single post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "firstName lastName role",
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Post retrieved",
      post,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error getting post",
      error: err.message,
    });
  }
});

// PUT /posts/:id - update a post
router.put("/:id", isLoggedIn, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // only author or admin can edit
    if (
      post.author.toString() !== req.session.user.id &&
      req.session.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.neighbourhood = req.body.neighbourhood || post.neighbourhood;
    post.role = req.body.role || post.role;

    const updatedPost = await post.save();

    res.status(200).json({
      message: "Post updated",
      post: updatedPost,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating post",
      error: err.message,
    });
  }
});

module.exports = router;
