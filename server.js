const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();



app.use(cors({
  origin: "*", // (you can put * temporarily or leave blank for now)
  credentials: true
}));

app.use(express.json());

// Auth Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// User Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// 📌 🔽 ADD Post Routes Here
const postRoutes = require("./routes/postRoutes");
app.use("/api/posts", postRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
