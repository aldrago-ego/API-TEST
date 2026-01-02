const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Importation du modèle Utilisateur
const bcrypt = require('bcryptjs');      // Pour le chiffrement du mot de passe
const jwt = require('jsonwebtoken');     // Pour générer le jeton (token)

// --------------------------------------------------------------------------
// ROUTE 1 : Inscription de l'utilisateur (Register)
// POST /api/auth/register
// --------------------------------------------------------------------------
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Vérification: L'utilisateur existe-t-il déjà ?
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Un utilisateur avec cet email existe déjà.' });
        }

        // 2. Création du nouvel utilisateur
        user = new User({
            name,
            email,
            password,
        });

        // 3. Chiffrement (Hashing) du mot de passe
        // Générer un "sel" (salt) pour rendre le hash unique et plus sécurisé
        const salt = await bcrypt.genSalt(10); 
        // Hacher le mot de passe avec le sel
        user.password = await bcrypt.hash(password, salt);

        // 4. Sauvegarde dans la base de données
        await user.save();
        
        // 5. Génération du Token JWT pour la connexion immédiate
        const payload = {
            user: {
                id: user.id, // L'ID MongoDB de l'utilisateur
            },
        };

        // Signature du Token (le SECRET est dans le .env)
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' }, // Le jeton expire après 5 heures
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { name: user.name, email: user.email } });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur du serveur');
    }
});


// --------------------------------------------------------------------------
// ROUTE 2 : Connexion de l'utilisateur (Login)
// POST /api/auth/login
// --------------------------------------------------------------------------
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Vérification: L'utilisateur existe-t-il ?
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Identifiants invalides.' });
        }

        // 2. Comparaison du mot de passe
        // Comparer le mot de passe fourni avec le hash stocké en BDD
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Identifiants invalides.' });
        }

        // 3. Génération du Token JWT
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { name: user.name, email: user.email } });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur du serveur');
    }
});

module.exports = router;