// On importe mongoose qui fait le lien entre Express et MongoDB
const mongoose = require("mongoose");

// On importe le module mongoose-unique-validator qui va gérer les erreurs d'unicité
const uniqueValidator = require("mongoose-unique-validator");

// On créer un modèle d'utilisateur
const userSchema = mongoose.Schema({
  // L'email est de type string et il est obligatoire
  // Il ne peut y avoir qu'un seul utilisateur par email
  email: { type: String, required: true, unique: true },
  // Le mot de passe est de type string et il est obligatoire
  password: { type: String, required: true },
});

// ???
userSchema.plugin(uniqueValidator);

// On exporte le modèle d'utilisateur créé
module.exports = mongoose.model("User", userSchema);
