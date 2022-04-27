// On importe mongoose qui fait le lien entre Express et MongoDB
const mongoose = require("mongoose");

// On se connecte à MongoDB grâce à mongoose
mongoose
  .connect(
    "mongodb+srv://clement:a1b2c3d4e5@cluster0.yxgdk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// On importe le framework express
const express = require("express");

// On crée un raccourci pour appeler express
const app = express();

// On importe le routeur d'utilisateurs dans l'API
const userRoutes = require("./routes/user");
app.use("/api/auth", userRoutes);

// On exporte l'API crée
module.exports = app;
