/**
 * Middleware d’authentification obligatoire
 * Vérifie le token JWT et attache l’utilisateur à l’objet request
 * Renvoie une erreur 401 si l’authentification échoue
 */
const requireAuth = async (req, res, next) => {
  // Voici comment vous pourrez rajouter des données dans req. Vous pourrez ensuite utiliser ces valeurs
  // req.user = user;
  // req.isAuthenticated = true;

}

/**
 * Middleware d’authentification optionnelle
 * Vérifie le token JWT si présent et attache l’utilisateur à l’objet request
 * Continue l’exécution même si l’authentification échoue
 */
const optionalAuth = async (req, res, next) => {

}
