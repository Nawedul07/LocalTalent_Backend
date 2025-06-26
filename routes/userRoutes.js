const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  followUser,
  unfollowUser,
  updateUserProfile,
  searchUsers,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

// 🔍 Search users (no auth required)
router.get("/search", searchUsers);
// 🔓 View user profile (public)
router.get("/:id", getUserProfile);

// 🔐 Follow/Unfollow/Update
router.put("/follow/:id", protect, followUser);
router.put("/unfollow/:id", protect, unfollowUser);
router.put("/update/:id", protect, updateUserProfile);



module.exports = router;
