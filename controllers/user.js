// On importe le module bcrypt qui permet de hasher le mot de passe
const bcrypt = require("bcrypt");

// On importe le module jsonwebtoken qui génère un token
const jwt = require("jsonwebtoken");

// On importe le modèle d'utilisateur que l'on a créé
const User = require("../models/User");

// On définit la fonction qui permet de s'inscrire
exports.signup = (req, res, next) => {
  // On demande à bcrypt d'hasher 10 fois le mot de passe
  // Plus de fois le MDP est hashé, plus il est sécurisé mais plus l'opération est longue à réaliser
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // On crée un nouvel utilisateur
      const user = new User({
        // L'email stocké dans la BDD est l'email saisi dans la requête
        email: req.body.email,
        // Le MDP stocké dans la BDD est le hash obtenu
        password: hash,
      });
      // On sauvegarde l'utilisateur créé dans la BDD
      user
        .save()
        // On renvoie le code 201 (Created) ainsi qu'un message de confirmation
        .then(() => res.status(201).json({ message: "Utilisateur créé" }))
        // On renvoie le code 400 (Bad Request) ainsi que l'erreur
        .catch((error) => res.status(400).json({ error }));
    })
    // On renvoie le code 500 (Internal Server Error) ainsi que l'erreur
    .catch((error) => res.status(500).json({ error }));
};

// On définit la fonction qui permet de se connecter
exports.login = (req, res, next) => {
  // On cherche dans la BDD l'utilisateur dont l'email correspond à celui qui a été saisi
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        // On renvoie le code 404 (Not Found) ainsi qu'un message d'erreur
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      // On compare le hash saisi et celui stocké dans la BDD
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            // On renvoie le code 401 (Unauthorized) ainsi qu'un message d'erreur
            return res.status(401).json({ error: "Mot de passe incorrect" });
          }
          // On renvoie le code 200 (OK) ainsi qu'un objet JSON
          res.status(200).json({
            // L'objet contient l'ID de l'utilisateur
            userId: user._id,
            // On génère un token codé avec la chaîne de caractères "RANDOM_TOKEN_SECRET" qui a une validité de 24 heures
            token: jwt.sign(
              { userId: user._id },
              process.env.JWT_SECRET_TOKEN,
              {
                expiresIn: "24h",
              }
            ),
          });
        })
        // On renvoie le code 500 (Internal Server Error) ainsi que l'erreur
        .catch((error) => res.status(500).json({ error }));
    })
    // On renvoie le code 500 (Internal Server Error) ainsi que l'erreur
    .catch((error) => res.status(500).json({ error }));
};
