const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const movies = require("../models/movies");
const user = require("../models/user");

// User registration
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    // check if user already exists
    const userexists = await User.findOne({ username });
    if (!userexists) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: username,
        password: hashedPassword,
        movieIdsAndQuantity: [],
      });
      // res.status(201).json({ message: "User registered successfully" });
      // return;
      user.save().then((result) => {
        console.log(result);
        res
          .status(201)
          .json({ message: "User registered successfully", user: result });
      });
    } else {
      res.status(409).json({ message: "User already exists" });
    }

    // res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (
      username == "darelife" &&
      jwt.verify(token, process.env.JWT_KEY) == "darelife"
    ) {
      const a = 1;
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/users", async (req, res) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "No header" });
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  if (decoded.userId !== "darelife" && decoded.password !== "darelife") {
    return res.status(401).json({ error: "Access denied" });
  }
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// router.delete("/users/:userId", async (req, res) => {
//   try {
//     const { userId, password } = req.body;
//     const user = await User.findById({ username: userId });
//     // console.log(user);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     const passwordMatch = await bcrypt.compare(password, user.password);
//     // console.log(passwordMatch);
//     if (!passwordMatch) {
//       return res.status(401).json({ error: "Authentication failed" });
//     }
//     await User.remove({ _id: userId });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete user", message: error });
//   }
// });

router.delete("/users/:userId", async (req, res) => {
  const id = req.params.userId;
  const password = req.body.password;
  const u = User.findById(id);
  User.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "User deleted" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
});

module.exports = router;
