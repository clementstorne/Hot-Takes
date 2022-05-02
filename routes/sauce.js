// On importe le framework express
const express = require("express");

// On crée un routeur
const router = express.Router();

// On importe les contrôleurs de sauces
const sauceCtrl = require("../controllers/sauce");

// On importe le middleware d'authentification
const auth = require("../middleware/authorize");

// On importe le middleware pour la gestion des images
const multer = require("../middleware/multer");

// On définit la route pour l'affichage de toutes les sauces
router.get("/", auth, sauceCtrl.getAllSauce);
// On définit la route pour l'affichage d'une sauce
router.get("/:id", auth, sauceCtrl.getOneSauce);
// On définit la route pour la création d'une sauce
router.post("/", auth, multer, sauceCtrl.createSauce);
// On définit la route pour la modification d'une sauce
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
// On définit la route pour la suppression d'une sauce
router.delete("/:id", auth, sauceCtrl.deleteSauce);
// On définit la route pour liker ou disliker une sauce
router.post("/:id/like", auth, sauceCtrl.likeSauce);

// On exporte le routeur créé
module.exports = router;
