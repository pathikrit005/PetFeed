const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend (Frontend folder)
app.use(express.static(path.join(__dirname, "../Frontend")));

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/signup.html"));
});

app.get("/feed", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/feed.html"));
});

app.get("/petprofile", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/petprofile.html"));
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "your-mongo-uri-here";
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

//Schemas
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
}, { timestamps: true });

const PetSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  type: String,
  breed: String,
  age: String,
  toy: String,
  personality: String,
  photo: String,
}, { timestamps: true });

const PostSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  content: String,
  photo: String,
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
const Pet = mongoose.model("Pet", PetSchema);
const Post = mongoose.model("Post", PostSchema);

// Helpers
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

//  Routes 

// --- Signup ---
app.post("/signup", asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const user = new User({ name, email, password });
  await user.save();
  res.json({ message: "Signup successful", userId: user._id });
}));

// --- Login ---
app.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  res.json({ message: "Login successful", userId: user._id });
}));

// --- Save Pet ---
app.post("/pet", asyncHandler(async (req, res) => {
  const pet = new Pet(req.body);
  await pet.save();
  res.json({ message: "Pet saved", pet });
}));

// --- Fetch Pets by User ---
app.get("/pet/:userId", asyncHandler(async (req, res) => {
  const pets = await Pet.find({ userId: req.params.userId });
  res.json(pets);
}));

// --- Create Post ---
app.post("/post", asyncHandler(async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.json({ message: "Post saved", post });
}));

// --- Get All Posts ---
app.get("/posts", asyncHandler(async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
}));

// Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server Started at http://localhost:${PORT}`)
);