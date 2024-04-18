// models/User.js
const mongoose = require("mongoose");
const movies = require("./movies");
const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  movieIdsAndQuantity: [
    {
      movieId: { type: mongoose.Schema.Types.ObjectId, ref: "movies" },
      quantity: { type: Number },
    },
  ],
});
module.exports = mongoose.model("User", userSchema);
