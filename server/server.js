// server.js
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const uri =
  "mongodb+srv://gautam:gautam@cluster0.0mjb7.mongodb.net/?retryWrites=true&w=majority"; // Replace with your database connection URI

// Connect to MongoDB
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// User model
const usersSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const NewUsers = mongoose.model("NewUsers", usersSchema);

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if(email && password){
    // Check if the username or email already exists
    const existingUser = await NewUsers.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new NewUsers({  email, password: hashedPassword });
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id }, "your-secret-key", {
      expiresIn: "1h",
    });
    res.status(201).json({ message: "User registered successfully", token });
  }
  else{
    res.status(500).json({ message: "Internal server error" });
    
  }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if(email && password){
      const user = await NewUsers.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Check the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, "your-secret-key", {
        expiresIn: "1h",
      });
      res.status(200).json({ token });
    }
    // Find the user by username
   else{
    res.status(500).json({ message: "Internal server error" });

   }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Protected route
app.get("/api/protected", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Protected route accessed successfully" });
});

app.get("/api/books/:page", async (req, res) => {
  const page = parseInt(req.params.page) || 1; // Current page number
  const limit = 40; // Number of items to fetch per page
  const skip = (page - 1) * limit; // Number of items to skip

  try {
    const collection = mongoose.connection.collection("mycollection");
    const [items, totalItems] = await Promise.all([
      collection.find().skip(skip).limit(limit).toArray(),
      collection.countDocuments(),
    ]);
    res.json({
      items,
      totalItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/api/search", async (req, res) => {
  const searchValue = req.body.searchValue;

  console.log(searchValue);
  try {
    const collection = mongoose.connection.collection("mycollection");
    const regex = new RegExp(searchValue, "i"); // 'i' for case-insensitive search

    const query = {
      $or: [{ name: regex }, { author: regex }, { genre: regex }],
    };
    console.log(query);

    const searchResult = await collection.find(query).toArray();
    console.log(searchResult);

    res.json(searchResult);
  } catch (error) {
    console.error("Error searching in MongoDB", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/api/rent", async (req, res) => {
  let bookId = req.body.id;
  let newCount = req.body.count;
  try {
    const collection = mongoose.connection.collection("mycollection");
    const Book = await collection.findOneAndUpdate(
      { _id: bookId },
      { $set: { availableCopy: newCount } },
      { new: true }
    );

    res.json(Book);
  } catch (e) {
    res.status(500).json({ error: "An error occurred" });
  }
});
// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      jwt.verify(token, "your-secret-key", (err, user) => {
        if (err) {
          return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json({ message: "Access token not found" });
    }
  } else {
    res.status(401).json({ message: "Authorization header not found" });
  }
}

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
