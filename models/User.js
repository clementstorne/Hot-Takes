// On importe mongoose qui fait le lien entre Express et MongoDB
const mongoose = require("mongoose");

// On importe le module mongoose-unique-validator qui va gérer les erreurs d'unicité
const uniqueValidator = require("mongoose-unique-validator");

// On créer un modèle d'utilisateur
const userSchema = mongoose.Schema({
  // L'email de l'utilisateur
  // Il ne peut y avoir qu'un seul utilisateur par email
  email: { type: String, required: true, unique: true },
  // Le mot de passe de l'utilisateur
  password: { type: String, required: true },
});

// ???
userSchema.plugin(uniqueValidator);

// On exporte le modèle d'utilisateur créé
module.exports = mongoose.model("User", userSchema);
