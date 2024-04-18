// darelife = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkYXJlbGlmZSIsImlhdCI6MTcxMzQxNjg4OX0.riS69qHzwID9pmcUt5vp4ss5p7P5q4JdFzWGtrCgDuo
const express = require("express");
const morgan = require("morgan"); //include morgan in our Express application
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const protectedRoute = require("./api/routes/protectedRoute");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const auth = require("./api/routes/auth");
const movies = require("./api/routes/movies");

const app = express();
app.use(morgan("dev")); //use it in the express application before handling routes
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/protectedRoute", protectedRoute);
app.use("/auth", auth);
app.use("/movies", movies);

//if the request reaches this point, i.e., it wasn't able to find the above two routes, it throws the following error!
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// mongodb+srv://prakharb2k6:<password>@devsoc.giyetec.mongodb.net/
mongoose
  .connect(
    "mongodb+srv://prakharb2k6:" +
      process.env.MONGO_ATLAS_PW +
      "@devsoc.giyetec.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(console.log("DB Connected"));

//error status code 500 means internal server error, the following middleware might not be useful at this point, but later on when we add a database and it has its own operations and something fails, our request will reach this and throw an error accordingly
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
