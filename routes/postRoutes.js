const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const Reply = require("../models/replies");
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

// Helper — attach replyCount to an array of posts
const attachReplyCounts = async (posts) => {
  const postIds = posts.map((p) => p._id);
  const counts = await Reply.aggregate([
    { $match: { post: { $in: postIds } } },
    { $group: { _id: "$post", count: { $sum: 1 } } },
  ]);

  const countMap = {};
  counts.forEach((c) => {
    countMap[c._id.toString()] = c.count;
  });

  return posts.map((post) => ({
    ...post.toObject(),
    replyCount: countMap[post._id.toString()] || 0,
  }));
};

// POST /posts - create a new post
router.post("/", isLoggedIn, async (req, res) => {
  try {
    const post = await createPostEntry({
      author: req.session.user.id,
      title: req.body.title,
      content: req.body.content,
      neighbourhood: req.body.neighbourhood,
      role: req.body.role,
    });
    res.status(201).json({ message: "Post created successfully", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /posts/autofill
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
    res
      .status(201)
      .json({ message: "Auto-filled post created successfully", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /posts - get all posts with reply counts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "author",
      "firstName lastName role",
    );
    const postsWithCounts = await attachReplyCounts(posts);
    res
      .status(200)
      .json({ message: "Posts retrieved", posts: postsWithCounts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /posts/mine - get logged-in user's posts with reply counts
router.get("/mine", isLoggedIn, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.session.user.id })
      .populate("author", "firstName lastName role")
      .sort({ createdAt: -1 });
    const postsWithCounts = await attachReplyCounts(posts);
    res
      .status(200)
      .json({ message: "User posts retrieved", posts: postsWithCounts });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error getting user posts", error: err.message });
  }
});

// GET /posts/:id
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "firstName lastName role",
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json({ message: "Post retrieved", post });
  } catch (err) {
    res.status(500).json({ message: "Error getting post", error: err.message });
  }
});

// DELETE /posts/:id
router.delete("/:id", isLoggedIn, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
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

// PUT /posts/:id
router.put("/:id", isLoggedIn, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
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
    res.status(200).json({ message: "Post updated", post: updatedPost });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating post", error: err.message });
  }
});

module.exports = router;
