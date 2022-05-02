// On importe le module jsonwebtoken qui va vérifier le token
const jwt = require("jsonwebtoken");

// On définitla fonction d'authentification
module.exports = (req, res, next) => {
  try {
    // On récupère le token dans le headers d'authentification
    // split créer un tableau avec les sous-chaînes séparées par un espace
    const token = req.headers.authorization.split(" ")[1];
    // On décode le token avec la clé choisie précédemment
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    // On récupère l'user ID dans le token décodé
    const userId = decodedToken.userId;
    // On ajoute ajoute l'user ID dans la requête pour éviter une faille de sécurité lors de la suppression
    req.auth = { userId };
    // Si l'user ID contenu dans la requête est différent de celui contenu dans le token
    if (req.body.userId && req.body.userId !== userId) {
      // On renvoie un message d'erreur
      throw "User ID non valable";
    } else {
      // Sinon, on permet de passer au middelware suivant
      next();
    }
  } catch (error) {
    // On renvoie le code 401 (Unauthorized) ainsi que l'erreur ou un message d'erreur
    res.status(401).json({ error: error | "Requête non authentifiée" });
  }
};
