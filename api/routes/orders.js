const express = require("express");
const router = express.Router(); //a sub-package of Express which helps us conveniently handle different routes

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Orders were successfully fetched!",
  });
});

router.post("/", (req, res, next) => {
  res.status(201).json({
    //code 201 is for successful resource creation
    message: "Orders were successfully posted!",
  });
});

module.exports = router; //so that it can be accessed in other files like app.js
