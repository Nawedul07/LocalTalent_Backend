const User = require("../models/user");


// get user profile 
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "name avatar")
      .populate("following", "name avatar");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Follow user
const followUser = async (req, res) => {
  try {
    const currentUserId = req.user; // from middleware
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!targetUser.followers.includes(currentUserId)) {
      targetUser.followers.push(currentUserId);
      await targetUser.save();
    }

    if (!currentUser.following.includes(targetUserId)) {
      currentUser.following.push(targetUserId);
      await currentUser.save();
    }

    res.json({ message: "User followed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// Unfollow user
const unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.user;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You can't unfollow yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);
    currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);

    await targetUser.save();
    await currentUser.save();

    res.json({ message: "User unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const currentUserId = req.user;
    const targetUserId = req.params.id;

    if (currentUserId !== targetUserId) {
      return res.status(403).json({ message: "You can only update your own profile" });
    }

    const { name, bio, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      targetUserId,
      { name, bio, avatar },
      { new: true }
    ).select("-password");
    console.log("Updating user with:", { name, bio, avatar });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Search Users by username
const searchUsers = async (req, res) => {
  const { name } = req.query;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const users = await User.find({
      name: { $regex: name, $options: "i" },
    }).select("name avatar _id");

    res.json(users);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
};

module.exports = {
  getUserProfile,
  followUser,
  unfollowUser,
  updateUserProfile,
  searchUsers, // 👈 export it
};

