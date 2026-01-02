const mongoose = require('mongoose');

// 1. Définition du schéma Utilisateur
const UserSchema = new mongoose.Schema({
    // L'email sera utilisé pour le login et doit être unique
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    // Le mot de passe sera stocké sous forme de HASH (chiffré)
    password: {
        type: String,
        required: true,
    },
    // Le nom de l'utilisateur (optionnel, mais pratique)
    name: {
        type: String,
        trim: true,
        default: 'Utilisateur',
    },
    // Champ pour stocker les références aux fichiers uploadés par cet utilisateur
    uploadedFiles: [
        {
            type: mongoose.Schema.Types.ObjectId, // Référence à un autre Modèle (File/Article)
            ref: 'File', // Le nom de la collection pour les fichiers (nous la créerons plus tard)
        },
    ],
}, { 
    // Ajoute automatiquement les champs 'createdAt' et 'updatedAt'
    timestamps: true 
});

// 2. Création et exportation du Modèle
const User = mongoose.model('User', UserSchema);

module.exports = User;