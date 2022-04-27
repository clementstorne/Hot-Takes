// On importe le framework express
const express = require("express");

// On crée un routeur
const router = express.Router();

// On importe les contrôleurs d'utilisateurs
const userCtrl = require("../controllers/user");

// On définit la route pour l'inscription d'un nouvel utilisateur
router.post("/signup", userCtrl.signup);

// On définit la route pour la connextion d'un utilisateur existant
router.post("/login", userCtrl.login);

// On exporte le routeur créé
module.exports = router;
