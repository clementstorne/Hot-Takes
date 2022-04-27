const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://clement:a1b2c3d4e5@cluster0.yxgdk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// const Product = require("./models/Product");

const express = require("express");
const app = express();

module.exports = app;
