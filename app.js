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

app.route("/").get((req, res) => {
  res.status(200).json({
    message: "Welcome to the DareLife's Movie Booking API!",
    routes: {
      auth: "/auth",
      movies: "/movies",
    },
    documentation: {
      movies: {
        "GET /movies": [
          "Returns a list of all movies in the database",
          "No Authorization Header Required",
          "Regular User Command: View all movies in the database",
        ],
        "POST /movies/add": [
          "Requires Authorization Header",
          "Admin Command",
          "Add a movie to the database",
          "Authorization Header -> { userId: <adminUsername>, password: <adminPassword> }",
          "Body -> { movieName: <movieName>, price: <price>, productImage: <productImage>, seatsRemaining: <seatsRemaining>, status: <status>, seatsSold: <seatsSold> }",
        ],
        "DELETE /movies/:productId": [
          "Requires Authorization Header",
          "Admin Command",
          "Delete a movie from the database",
          "Authorization Header -> { userId: <adminUsername>, password: <adminPassword> }",
        ],
        "PATCH /movies/:productId": [
          "Requires Authorization Header",
          "Admin Command",
          "Update a movie in the database",
          "Authorization Header -> { userId: <adminUsername>, password: <adminPassword> }",
          "Body -> [{ propName: <propertyToChange>, value: <newValue> }, { propName: <propertyToChange>, value: <newValue>}]",
        ],
        "POST /movies/buy": [
          "Requires Authorization Header",
          "Regular User Command",
          "Buy a ticket for a movie, decrement the seatsRemaining and increment the seatsSold for that movie in the database",
          "Add the movie to the user's list of purchased movies in the database",
          "Authorization Header -> { userId: <userId>, password: <password> }",
          "Body -> { movieId: <movieId>, quantity: <quantity> }",
        ],
      },
      auth: {
        "POST /auth/register": [
          "Register a new user",
          "Body -> { username: <username>, password: <password> }",
        ],
        "POST /auth/login": [
          "Login an existing user",
          "Body -> { username: <username>, password: <password> }",
        ],
        "GET /auth/users": [
          "Requires Authorization Header",
          "Admin Command",
          "View all users in the database",
        ],
        "DELETE /auth/users/:userId": [
          "Requires Authorization Header",
          "Admin Command",
          "Delete a user from the database",
          "Authorization Header -> { userId: <adminUsername>, password: <adminPassword> }",
          "Body -> { password: <password> }",
        ],
      },
      home: {
        "GET /": [
          "Welcome to the DareLife's Movie Booking API!",
          "This is the home route of the API",
          "Documentation: /auth, /movies",
        ],
      },
    },
  });
});

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
