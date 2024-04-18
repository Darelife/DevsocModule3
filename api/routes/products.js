const express = require("express");
const router = express.Router(); //a sub-package of Express which helps us conveniently handle different routes

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Handling GET requests to /products route",
  });
});

router.post("/", (req, res, next) => {
  res.status(201).json({
    message: "Handling POST requests to /products route",
  });
});

router.get("/:productId", (req, res, next) => {
  //for any endpoint after /products, here I chose productId for better readability
  const id = req.params.productId; //this is how we can store the variable endpoint using request params
  if (id === "special") {
    res.status(200).json({
      message: "You discovered a special product!",
      id: id,
    });
  } else {
    res.status(200).json({
      message: "You passed a new ID",
      id: id,
    });
  }
});

module.exports = router; //so that it can be accessed in other files like app.js
