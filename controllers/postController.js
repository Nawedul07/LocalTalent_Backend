const Post = require("../models/post");

// Create a new post
const createPost = async (req, res) => {
  try {
    const { caption, image } = req.body;

    const post = new Post({
      userId: req.user, // ✅ comes from JWT token
      caption,
      image
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error("Error creating post:", err.message); // helpful log
    res.status(500).json({ message: "Error creating post" });
  }
};

// Get all posts
// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name avatar") // Post author
      .populate("comments.userId", "name avatar"); // Commenter info

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};



// Get posts by a specific user
const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const posts = await Post.find({ userId }).sort({ createdAt: -1 })
      .populate("userId", "name avatar") // Optional but useful
      .populate("comments.userId", "name avatar"); // Optional

    res.json(posts);
  } catch (err) {
    console.error("Error in getUserPosts:", err);
    res.status(500).json({ message: "Error fetching user posts" });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.user; // ✅ From token

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(userId)) {
      post.likes.pull(userId); // Unlike
      await post.save();
      return res.json({ message: "Post unliked" });
    }

    post.likes.push(userId); // Like
    await post.save();
    res.json({ message: "Post liked" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.user; // ✅ From token
    const { comment } = req.body;

    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ userId, comment });
    await post.save();

    res.status(201).json({ message: "Comment added", post });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const commentIndex = post.comments.findIndex(
      (c) => c._id.toString() === req.params.commentId
    );

    if (commentIndex === -1) return res.status(404).json({ message: "Comment not found" });

    const comment = post.comments[commentIndex];

    if (comment.userId.toString() !== req.user) {
      return res.status(401).json({ message: "Not authorized to delete this comment" });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    res.json({ message: "Comment deleted", post });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Optional: Only allow user who created the post to delete it
    if (post.userId.toString() !== req.user) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getUserPosts,
  likePost,
  commentOnPost,
  deletePost,
  deleteComment
};
