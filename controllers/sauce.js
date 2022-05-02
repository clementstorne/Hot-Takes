// On importe le modèle de sauce que l'on a créé
const Sauce = require("../models/Sauce");

// On importe le package file system pour gérer la suppression des images en cas de suppression d'une sauce
const fs = require("fs");

// On définit la fonction qui permet d'afficher toutes les sauces
exports.getAllSauce = (req, res, next) => {
  // On utilise la méthode .find() pour chercher toutes les sauces qui existent sur la BDD
  Sauce.find()
    .then((sauces) => {
      // On renvoie le code 200 (OK) ainsi qu'un objet JSON qui contient les sauces
      res.status(200).json(sauces);
    })
    .catch((error) => {
      // On renvoie le code 400 (Bad Request) ainsi que l'erreur
      res.status(400).json({ error });
    });
};

// On définit la fonction qui permet d'afficher une sauce
exports.getOneSauce = (req, res, next) => {
  // On utilise la méthode .findOne() pour chercher la sauce dont l'ID correspond à celui de la requête
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      // On renvoie le code 200 (OK) ainsi qu'un objet JSON qui contient la sauce
      res.status(200).json(sauce);
    })
    .catch((error) => {
      // On renvoie le code 404 (Not Found) ainsi que l'erreur
      res.status(400).json({ error });
    });
};

// On définit la fonction qui permet de créer une sauce
exports.createSauce = (req, res, next) => {
  // On crée un objet à partir du corps de la requête
  const sauceObject = JSON.parse(req.body.sauce);
  // On supprime l'ID envoyé par le frontend
  delete sauceObject._id;
  // On crée une nouvelle instance de notre modèle Sauce
  const sauce = new Sauce({
    // La nouvelle sauce récupère les infos contenues dans le corps de la requête
    ...sauceObject,
    // On initialise le nombre de likes et de dislikes de la sauce à 0
    likes: 0,
    dislikes: 0,
    // On initialise les tableaux d'utilisateurs ayant liké/disliké la sauce
    usersLiked: [],
    usersDisliked: [],
    // On définit l'URL de l'image avec le protocole utilisé, le serveur et le nom du fichier
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => {
      // On renvoie le code 201 (Created) ainsi qu'un message de confirmation
      res.status(201).json({ message: "Sauce créée avec succès" });
    })
    .catch((error) =>
      // On renvoie le code 400 (Bad Request) ainsi que l'erreur
      res.status(400).json({ error })
    );
};

// On définit la fonction qui permet de modifier une sauce
exports.modifySauce = (req, res, next) => {
  // Le comportement est différent si la requête comporte un fichier ou non
  const sauceObject = req.file
    ? {
        // S'il y a une image, on convertit l'objet contenu dans le corps de la requête au format JS
        ...JSON.parse(req.body.sauce),
        // On définit l'URL de l'image avec le protocole utilisé, le serveur et le nom du fichier
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : // S'il n'y a pas d'image, on procède comme précédemment en récupérant le corps de la requête
      { ...req.body };
  Sauce.updateOne(
    // On met à jour l'ID avec celui contenu dans la requête
    { _id: req.params.id },
    // On met à jour les informations avec celles contenues dans la requête
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => {
      // On renvoie le code 200 (OK) ainsi qu'un message de confirmation
      res.status(200).json({ message: "Sauce mise à jour avec succès" });
    })
    .catch((error) =>
      // On renvoie le code 400 (Bad Request) ainsi que l'erreur
      res.status(400).json({ error })
    );
};

// On définit la fonction qui permet de supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  // On cherche la sauce dont l'ID correspond à celui contenu dans la requête
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    // Si la sauce n'existe pas dans la BDD
    if (!sauce) {
      // On renvoie le code 404 (Not Found) ainsi qu'une nouvelle erreur
      res.status(404).json({
        error: new Error("Cette sauce n'existe pas"),
      });
    }
    // Si l'utilisateur n'est pas celui qui a créé la sauce
    if (sauce.userId !== req.auth.userId) {
      // On renvoie le code 401 (Unauthorized) ainsi qu'une nouvelle erreur
      res.status(401).json({
        error: new Error(
          "Vous ne pouvez pas supprimer une sauce dont vous n'êtres pas le propriétaire"
        ),
      });
    }
    // On récupère le nom du fichier image
    const filename = sauce.imageUrl.split("/images/")[1];
    // On supprime l'image puis l'objet
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => {
          // On renvoie le code 200 (OK) ainsi qu'un message de confirmation
          res.status(200).json({ message: "Sauce supprimée" });
        })
        .catch((error) =>
          // On renvoie le code 400 (Bad Request) ainsi que l'erreur
          res.status(400).json({ error })
        );
    });
  });
};

// On définit la fonction qui permet de liker/disliker une sauce
exports.likeSauce = (req, res, next) => {
  // On cherche la sauce dont l'ID correspond à celui contenu dans la requête
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    // Si la sauce n'existe pas dans la BDD
    if (!sauce) {
      // On renvoie le code 404 (Not Found) ainsi qu'une nouvelle erreur
      return res.status(404).json({
        error: new Error("Cette sauce n'existe pas"),
      });
    }
    // On cherche dans le tableau des like l'index de l'user ID (-1 s'il n'existe pas et >= 0 sinon)
    const userLikeIndex = sauce.usersLiked.findIndex(
      (userId) => userId == req.body.userId
    );
    // On cherche dans le tableau des dislike l'index de l'user ID (-1 s'il n'existe pas et >= 0 sinon)
    const userDislikeIndex = sauce.usersDisliked.findIndex(
      (userId) => userId == req.body.userId
    );
    // Si l'utilisateur a cliqué sur le bouton de like
    if (req.body.like === 1) {
      // Si l'user ID est déjà dans le tableau des likes
      if (userLikeIndex !== -1) {
        // On renvoie le code 500 (Internal Server Error) ainsi qu'une nouvelle erreur
        return res.status(500).json({
          error: new Error("L'utilisateur a déjà liké cette sauce"),
        });
      }
      // Si l'user ID est déjà dans le tableau des dislikes
      if (userDislikeIndex !== -1) {
        // On supprime l'user ID du tableau des dislikes et on soustrait 1 au nombre de dislikes
        sauce.usersDisliked.splice(userDislikeIndex, 1);
        sauce.dislikes--;
      }
      // On ajoute l'user ID dans le tableau des likes et on ajoute 1 au nombre de dislikes
      sauce.usersLiked.push(req.body.userId);
      sauce.likes++;
    }
    // Si l'utilisateur a cliqué sur le bouton de dislike
    if (req.body.like === -1) {
      // Si l'user ID est déjà dans le tableau des dislikes
      if (userDislikeIndex !== -1) {
        // On renvoie le code 500 (Internal Server Error) ainsi qu'une nouvelle erreur
        return res.status(500).json({
          error: new Error("L'utilisateur a déjà disliké cette sauce"),
        });
      }
      // Si l'user ID est déjà dans le tableau des likes
      if (userLikeIndex !== -1) {
        // On supprime l'user ID du tableau des likes et on soustrait 1 au nombre de likes
        sauce.usersLiked.splice(userLikeIndex, 1);
        sauce.likes--;
      }
      // On ajoute l'user ID dans le tableau des dislikes et on ajoute 1 au nombre de dislikes
      sauce.usersDisliked.push(req.body.userId);
      sauce.dislikes++;
    }
    // Si l'utilisateur a annulé son like/dislike
    if (req.body.like === 0) {
      // Si l'user ID est déjà dans le tableau des dislikes
      if (userDislikeIndex !== -1) {
        // On supprime l'user ID du tableau des dislikes et on soustrait 1 au nombre de dislikes
        sauce.usersDisliked.splice(userDislikeIndex, 1);
        sauce.dislikes--;
      }
      // Si l'user ID est déjà dans le tableau des likes
      else if (userLikeIndex !== -1) {
        // On supprime l'user ID du tableau des likes et on soustrait 1 au nombre de likes
        sauce.usersLiked.splice(userLikeIndex, 1);
        sauce.likes--;
      }
    }
    // On met à jour la sauce dont l'id correspond à celui contenu dans les paramètres de la requête
    Sauce.updateOne({ _id: req.params.id }, sauce).then(() => {
      // On renvoie le code 200 (OK) ainsi qu'un message de confirmation
      res.status(200).json({ message: "Avis pris en compte" });
    });
  });