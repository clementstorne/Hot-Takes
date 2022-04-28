// On importe mongoose qui fait le lien entre Express et MongoDB
const mongoose = require("mongoose");

// On créer un modèle de sauce
const sauceSchema = mongoose.Schema({
  // L'identifiant de l'utilisateur qui a créé la sauce
  userId: { type: String, required: true },
  // Le nom de la sauce
  name: { type: String, required: true },
  // Le fabricant de la sauce
  manufacturer: { type: String, required: true },
  // La description de la sauce
  description: { type: String, required: true },
  // Le principal ingrédient épicé de la sauce
  mainPepper: { type: String, required: true },
  // L'URL de l'image de la sauce téléchargée par l'utilisateur
  imageUrl: { type: String, required: true },
  // Un nombre entre 1 et 10 qui décrit le niveau de piquant de la sauce
  heat: { type: Number, min: 1, max: 10, required: true },
  // Le nombre d'utilisateurs qui aiment la sauce
  likes: { type: Number, required: true },
  // Le nombre d'utilisateurs qui n'aiment pas la sauce
  dislikes: { type: Number, required: true },
  // Un tableau des ID des utilisateurs qui aiment la sauce
  usersLiked: { type: [String], required: true },
  // Un tableau des ID des utilisateurs qui n'aiment pas la sauce
  usersDisliked: { type: [String], required: true },
});

// On exporte le modèle de sauce créé
module.exports = mongoose.model("Sauce", sauceSchema);
