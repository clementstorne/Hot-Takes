// On importe le module bcrypt qui permet d'importer des fichiers
const multer = require("multer");

// On ne peut pas accéder directement à l'extension du fichier
// On crée donc un dictionnaire pour définir l'extension du fichier
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// On définit une configuration de stockage
const storage = multer.diskStorage({
  // On détermine l'emplacement où enregistrer les fichiers envoyés
  destination: (req, file, callback) => {
    // Les images seront envoyées dans le dossier images
    callback(null, "images");
  },
  // On détermine le nom des fichiers envoyés pour qu'ils soient uniques
  filename: (req, file, callback) => {
    // On supprime les espaces dans le nom de fichier et on les remplace par des underscore
    const name = file.originalname.split(" ").join("_");
    // On définit l'extension grâce à notre dictionnaire
    const extension = MIME_TYPES[file.mimetype];
    // Le nom du fichier envoyé sera composé de son nom auquel on ajoute la date d'envoi
    callback(null, name + Date.now() + "." + extension);
  },
});

// On exporte la configuration de stockage
// .single("image") indique qu'on ne gère que l'upload d'images
module.exports = multer({ storage }).single("image");
