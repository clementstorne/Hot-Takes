// On utilise dotenv pour appeler les variables d'environnement (données sensibles)
require("dotenv").config();

// On importe mongoose qui fait le lien entre Express et MongoDB
const mongoose = require("mongoose");

// On construit l'URL pour se connecter à la BDD
const mongodbURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.4nsox.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// On se connecte à MongoDB grâce à mongoose
mongoose
  .connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection to MongoDB succeeded"))
  .catch(() => console.log("Connection to MongoDB failed"));

// On importe le framework express
const express = require("express");

// On crée un raccourci pour appeler express
const app = express();

// On utilise helmet pour se protéger de certaines des vulnérabilités en configurant des en-têtes HTTP
const helmet = require("helmet");
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

// Permet d'analyser le corps de la requête
app.use(express.json());

// On utilise express-mongo-sanitize pour se protéger contre l'injection de code
const mongoSanitize = require("express-mongo-sanitize");
app.use(mongoSanitize());

// On utilise express-rate-limit pour limiter le nombre de requêtes et protéger des attaques par force brute
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  // Intervalle de temps
  windowMs: 15 * 60 * 1000, // 15 minutes
  // Nombre maximum de requêtes par intervalle de temps pour une même adresse IP
  max: 100,
  // Renvoie les infos de limitation dans le header `RateLimit-*`
  standardHeaders: true,
  // Désactive le header `X-RateLimit-*`
  legacyHeaders: false,
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// Pour éviter les erreurs de CORS
app.use((req, res, next) => {
  // Pour accéder à l'API depuis n'importe quelle origine
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Pour autoriser certains headers
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  // Pour autoriser certaines méthodes
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// On importe le routeur d'utilisateurs dans l'API
const userRoutes = require("./routes/user");
app.use("/api/auth", userRoutes);

// On importe le routeur de sauces dans l'API
const sauceRoutes = require("./routes/sauce");
app.use("/api/sauces", sauceRoutes);

// L'accès aux images doit être géré de façon statique
const path = require("path");
app.use("/images", express.static(path.join(__dirname, "images")));

// On exporte l'API créée
module.exports = app;
