const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path'); 
const fs = require('fs'); 

// --- Imports et Configuration Supabase ---
const { createClient } = require('@supabase/supabase-js');
const auth = require('../middleware/auth'); 
const File = require('../models/File');

// Récupérez vos clés d'environnement. Assurez-vous d'utiliser un package comme `dotenv`.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Clé de rôle de service
const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = 'articles2'; // Nom de votre bucket Supabase
const SUPABASE_BASE_URL = `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/`;

// --- 1. Configuration de Multer (Stockage EN MÉMOIRE) ---
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
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite à 5MB
    fileFilter: fileFilter 
});


// --- 2. Route Protégée d'Upload (POST /api/files/upload) ---
router.post('/upload', auth, upload.single('articleFile'), async (req, res) => {
    
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'Aucun fichier PDF n\'a été téléchargé ou le format est invalide.' });
        }

        // 1. Création du chemin de destination unique dans le bucket
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

        const supabaseFilePath = data.path; // Le chemin RELATIF stocké dans la BDD
        // 🚀 CORRECTION: publicUrl est défini ICI après data.path
        const publicUrl = SUPABASE_BASE_URL + supabaseFilePath; 

        // 3. Sauvegarde des métadonnées dans la BDD (Mongoose)
        const newFile = new File({
            user: req.user.id, 
            filename: supabaseFilePath, // Stocke le path Supabase (relatif)
            originalName: req.file.originalname,
            filePath: supabaseFilePath, // Stocke le path Supabase (relatif)
        });
        
        const file = await newFile.save();

        // 4. Réponse au client
        res.status(200).json({
            msg: 'Fichier PDF téléchargé et enregistré dans Supabase avec succès.',
            file: {
                id: file._id,
                originalName: file.originalName,
                storagePath: file.filePath,
                publicUrl: publicUrl // Renvoyer l'URL publique
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur du serveur lors du téléchargement et de la sauvegarde.');
    }
});


// --- 3. Route PUBLIQUE de Récupération (GET /api/files/public) ---
router.get('/public', async (req, res) => {
    try {
        const files = await File.find().select('originalName uploadDate _id filePath'); 
        
        if (files.length === 0) {
            return res.status(200).json([]); 
        }

        // Calcule le publicUrl pour chaque fichier
        const filesWithPublicUrl = files.map(file => {
            // Utilise toObject() pour manipuler l'objet Mongoose
            const fileObj = file.toObject ? file.toObject() : file; 
            const publicUrl = SUPABASE_BASE_URL + fileObj.filePath;
            
            return {
                ...fileObj,
                publicUrl: publicUrl // AJOUT DU CHAMP publicUrl
            };
        });
        
        res.json(filesWithPublicUrl); 

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur du serveur lors de la récupération de la liste publique.');
    }
});

// --- 4. Route Protégée de Récupération (GET /api/files) ---
router.get('/', auth, async (req, res) => {
    try {
        const files = await File.find({ user: req.user.id }).select('originalName uploadDate _id filePath'); 
        
        if (files.length === 0) {
            return res.status(200).json({ 
                msg: 'Aucun fichier trouvé pour cet utilisateur.',
                files: []
            });
        }

        // Calcule le publicUrl pour chaque fichier
        const filesWithPublicUrl = files.map(file => {
            const fileObj = file.toObject ? file.toObject() : file; 
            const publicUrl = SUPABASE_BASE_URL + fileObj.filePath;
            
            return {
                ...fileObj,
                publicUrl: publicUrl // AJOUT DU CHAMP publicUrl
            };
        });
        
        res.json(filesWithPublicUrl); // Renvoyer les fichiers avec l'URL publique

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur du serveur lors de la récupération de la liste des fichiers.');
    }
});


module.exports = router;