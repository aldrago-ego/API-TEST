const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Définition du schéma pour les fichiers UML/XML
const FileSchema = new Schema({
    // Référence à l'utilisateur qui a uploadé le fichier
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Fait référence au modèle User
        required: true
    },
    // Informations du fichier stockées par Multer
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    // Le chemin d'accès au fichier sur le serveur
    filePath: {
        type: String,
        required: true
    },
    // Autres métadonnées
    uploadDate: {
        type: Date,
        default: Date.now
    },
    // Champ pour stocker les résultats de l'analyse (ex: Classes UML extraites)
    analysisResult: {
        type: Schema.Types.Mixed // Type flexible pour stocker JSON/objets complexes
    }
});

module.exports = mongoose.model('File', FileSchema);