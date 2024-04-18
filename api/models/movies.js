const mongoose = require("mongoose"); //include the mongoose library

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, //ObjectId is a special Type that comes with mongoose Schema Types(Note that Schema Types is used in the model schema and Types is used in the actual route), it is basically a very long unique string that follows some conventions
  movieName: String, //assign String type to the movieName
  price: Number, //assign Number type to price
  productImage: String, //assign String type to productImage
  seatsRemaining: Number, //assign Number type to seatsRemaining
  status: String, //assign String type to status. Eg: 3pm - 6pm
  seatsSold: Number, //assign Number type to seatsSold
});

module.exports = mongoose.model("Product", productSchema); //first parameter is a string that we can use across our backend for the particular model schema, in this case it's Product
