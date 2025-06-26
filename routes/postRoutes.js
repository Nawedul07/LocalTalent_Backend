const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getUserPosts,
  likePost,
  commentOnPost,
  deletePost,
  deleteComment
} = require("../controllers/postController");

const protect = require("../middleware/authMiddleware");

// 🔐 Create post
router.post("/", protect, createPost);

// 🔓 Get all posts
router.get("/", getAllPosts);

// 🔓 Get posts by user
router.get("/user/:id", getUserPosts);

// 🔐 Like / Unlike a post
router.put("/like/:id", protect, likePost);

// 🔐 Add a comment
router.post("/comment/:id", protect, commentOnPost);

// delete a comment 

router.delete("/comment/:postId/:commentId", protect, deleteComment);


// 🔐 Delete a post
router.delete("/:id", protect, deletePost);

module.exports = router;
