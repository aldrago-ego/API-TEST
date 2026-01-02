const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Récupérer le jeton (token) de l'en-tête
    // Le token est généralement envoyé dans l'en-tête 'x-auth-token' ou 'Authorization'
    const token = req.header('x-auth-token');

    // 2. Vérifier si le jeton existe
    if (!token) {
        // Code 401: Non autorisé
        return res.status(401).json({ msg: 'Aucun jeton, autorisation refusée.' });
    }

    try {
        // 3. Vérifier et décoder le jeton
        // process.env.JWT_SECRET est la clé secrète utilisée pour signer le jeton lors du login
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Ajouter l'objet utilisateur (l'ID) à l'objet de la requête (req)
        // L'ID de l'utilisateur est maintenant disponible via req.user.id dans toutes les routes protégées
        req.user = decoded.user;
        
        // Passer au middleware/route suivant
        next(); 

    } catch (err) {
        // Jeton invalide ou expiré
        res.status(401).json({ msg: 'Jeton non valide.' });
    }
};