const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const movies = require("../models/movies");
const verifyToken = require("../../middleware/authMiddleware");

// check the list of movies
router.get("/", async (req, res) => {
  try {
    const allMovies = await movies.find();
    res.status(200).json(allMovies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

router.post("/add", async (req, res) => {
  try {
    const {
      movieName,
      price,
      productImage,
      seatsRemaining,
      status,
      seatsSold,
    } = req.body;
    // use the verifyToken middleware to check if the user is authenticated
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "No header" });
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (decoded.userId !== "darelife" && decoded.password !== "darelife") {
      return res.status(401).json({ error: "Access denied" });
    }
    const movie = new movies({
      _id: new mongoose.Types.ObjectId(),
      movieName,
      price,
      productImage,
      seatsRemaining,
      status,
      seatsSold,
    });
    movie.save().then((result) => {
      console.log(result);
      res
        .status(201)
        .json({ message: "Movie added successfully", movie: result });
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add movie" });
  }
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const mov = movies.findById(id);
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "No header" });
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  if (decoded.userId !== "darelife" && decoded.password !== "darelife") {
    return res.status(401).json({ error: "Access denied" });
  }
  if (mov.seatsSold > 0) {
    return res
      .status(400)
      .json({ error: "Cannot delete movie with sold seats" });
  }
  movies
    .deleteOne({
      _id: id, //this essentially acts as a filter and removes any product object whose ID matches with the ID in the request parameters
    })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "No header" });
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  if (decoded.userId !== "darelife" && decoded.password !== "darelife") {
    return res.status(401).json({ error: "Access denied" });
  }
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  movies
    .updateOne(
      {
        _id: id,
      },
      {
        $set: updateOps,
      }
    )
    .exec()
    .then((result) => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
});

router.post("/buy", async (req, res) => {
  try {
    const movieId = req.body.movieId;
    const quantity = req.body.quantity;
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "No header" });
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findOne({ username: decoded.userId });
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    // check if the users password matches the password in the token
    const passwordMatch = await bcrypt.compare(decoded.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "The password didn't match" });
    }
    // check if the movieId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }
    // check if the user has already bought the movie
    const movieIndex = user.movieIdsAndQuantity.findIndex(
      (movie) => movie.movieId == movieId
    );
    if (movieIndex !== -1) {
      return res.status(400).json({ error: "Movie already bought" });
    }
    user.movieIdsAndQuantity.push({ movieId, quantity });
    // quantity is an integer
    if (!quantity) {
      return res.status(400).json({ error: "Quantity not specified" });
    }
    movies.findById(movieId).then((movie) => {
      if (movie.seatsRemaining < quantity) {
        return res.status(400).json({ error: "Not enough seats" });
      }
      movie.seatsRemaining -= quantity;
      movie.seatsSold += quantity;

      movie.save().then((result) => {
        console.log(result);
        res.status(201).json({ message: "Movie bought successfully", movie });
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to buy movie" });
  }
});

module.exports = router;
