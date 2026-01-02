const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path'); // Nécessaire pour l'extension
const fs = require('fs'); // Réintégré pour l'importation (bien qu'il ne soit plus utilisé dans l'upload)

// --- Imports et Configuration Supabase ---
const { createClient } = require('@supabase/supabase-js');
const auth = require('../middleware/auth'); 
const File = require('../models/File');

// Récupérez vos clés d'environnement. Assurez-vous d'utiliser un package comme `dotenv`.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Clé de rôle de service
const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = 'articles2'; // Nom de votre bucket Supabase

// --- 1. Configuration de Multer (Stockage EN MÉMOIRE) ---
// Utiliser memoryStorage pour obtenir un buffer du fichier avant l'envoi à Supabase
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Vérifie le type MIME pour s'assurer que c'est un PDF
    if (file.mimetype === 'application/pdf') {
        cb(null, true); 
    } else {
        cb(new Error('Format de fichier non supporté. PDF requis.'), false);
    }
};

const upload = multer({ 
    storage: storage, // Utilisation du stockage en mémoire
    limits: { fileSize: 5 * 1024 * 1024 }, // Exemple: Limite à 5MB
    fileFilter: fileFilter 
});


// --- 2. Route Protégée d'Upload (POST /api/files/upload) ---

// Le champ attendu dans le formulaire doit être 'articleFile' (ajustez si besoin)
router.post('/upload', auth, upload.single('articleFile'), async (req, res) => {
    
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'Aucun fichier PDF n\'a été téléchargé ou le format est invalide.' });
        }

        // 1. Création du chemin de destination unique dans le bucket
        // Format recommandé : user_id/timestamp-originalname
        const fileName = `${req.user.id}/${Date.now()}-${req.file.originalname}`;
        
        // 2. Upload vers Supabase Storage
        const { data, error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false 
            });

        if (uploadError) {
            console.error('Erreur Supabase lors de l\'upload:', uploadError);
            return res.status(500).json({ msg: 'Échec de l\'upload du fichier vers Supabase.' });
        }

        const supabaseFilePath = data.path; // Le chemin relatif dans le bucket (ex: 'user_id/...')

        // 3. Sauvegarde des métadonnées dans la BDD (Mongoose)
        const newFile = new File({
            user: req.user.id, 
            filename: supabaseFilePath, // Stocke le path Supabase
            originalName: req.file.originalname,
            filePath: supabaseFilePath, // Utilisation cohérente du champ pour le path Supabase
            // analysisResult: {} // Si vous avez ce champ dans votre modèle
        });
        
        const file = await newFile.save();

        // 4. Réponse au client
        res.status(200).json({
            msg: 'Fichier PDF téléchargé et enregistré dans Supabase avec succès.',
            file: {
                id: file._id,
                originalName: file.originalName,
                storagePath: file.filePath
            }
        });

    } catch (err) {
        // Gère les erreurs Multer (limites de taille, filtre de fichier) ou BDD
        console.error(err.message);
        // Retiré fs.unlinkSync car l'upload n'écrit plus sur le disque
        res.status(500).send('Erreur du serveur lors du téléchargement et de la sauvegarde.');
    }
});


// --- 3. Route PUBLIQUE de Récupération (GET /api/files/public) ---

router.get('/public', async (req, res) => {
    try {
        // AJOUT de 'filePath' (chemin Supabase) pour permettre le téléchargement frontend
        const files = await File.find().select('originalName uploadDate _id filePath'); 
        
        if (files.length === 0) {
            // Renvoie un tableau vide
            return res.status(200).json([]); 
            // NOTE: Pour la cohérence avec le frontend, on renvoie directement le tableau.
        }

        res.json(files); // Renvoie directement le tableau d'objets files

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur du serveur lors de la récupération de la liste publique.');
    }
});


// --- 4. Route Protégée de Récupération (GET /api/files) ---

// Récupère la liste de tous les fichiers de l'utilisateur CONNECTÉ
router.get('/', auth, async (req, res) => {
    try {
        // Inclut 'filePath' pour que l'utilisateur puisse télécharger ses propres fichiers
        const files = await File.find({ user: req.user.id }).select('originalName uploadDate _id filePath'); 
        
        if (files.length === 0) {
            return res.status(200).json({ 
                msg: 'Aucun fichier trouvé pour cet utilisateur.',
                files: [] // Renvoie { files: [] } pour les routes protégées
            });
        }

        res.json(files); // Renvoie directement le tableau d'objets files

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur du serveur lors de la récupération de la liste des fichiers.');
    }
});


module.exports = router;