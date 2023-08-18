const express = require("express");
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/bot", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Define a user schema
const userSchema = new mongoose.Schema({
  chat_id: String,
  times: [String],
  type: {
    type: String,
    enum: ["water", "medecine"],
  },
});

// Create a user model
const User = mongoose.model("User", userSchema);

// Create an Express app
const app = express();
app.use(express.json());

// POST /set-user
app.post("/set-user", async (req, res) => {
  try {
    const { chat_id, times, type } = req.body;
    const user = new User({ chat_id, times, type });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /get-user
app.get("/get-user", async (req, res) => {
  try {
    const { chat_id } = req.query;
    const user = await User.findOne({ chat_id }).select('-__v');

    if (!user) {
      throw new Error("User not found");
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
