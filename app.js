// On importe mongoose qui fait le lien entre Express et MongoDB
const mongoose = require("mongoose");

// On se connecte à MongoDB grâce à mongoose
mongoose
  .connect(
    "mongodb+srv://admin:azerty@cluster0.4nsox.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// On importe le framework express
const express = require("express");

// On crée un raccourci pour appeler express
const app = express();

// Permet d'analyser le corps de la requête
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// On importe le routeur d'utilisateurs dans l'API
const userRoutes = require("./routes/user");
app.use("/api/auth", userRoutes);

// On exporte l'API créée
module.exports = app;
