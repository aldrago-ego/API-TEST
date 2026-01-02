import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// URL de base de votre backend (déjà définie dans AuthService)
const API_BASE_URL = 'https://api-test-htff.onrender.com/api'; 

// Interface pour les objets Fichier que l'API renvoie
export interface FileItem {
    _id: string;
    originalName: string;
    uploadDate: Date;
    filePath: string; // Chemin relatif Supabase
    publicUrl?: string; // L'URL complète si elle est renvoyée par le backend
}

@Injectable({
    providedIn: 'root'
})
export class FileService {

    constructor(private http: HttpClient) { }

    /**
     * Récupère la liste de tous les fichiers publics.
     * Endpoint: GET /api/files/public
     */
    getPublicFiles(): Observable<FileItem[]> {
        // Le `?t=timestamp` (cache buster) est une bonne pratique, mais pas strictement nécessaire ici,
        // car le cache est généralement géré par le serveur. Utilisons l'URL standard :
        return this.http.get<FileItem[]>(`${API_BASE_URL}/files/public`);
    }

    /**
     * Télécharge un nouveau fichier PDF.
     * Endpoint: POST /api/files/upload (nécessite une authentification)
     */
    uploadFile(file: File): Observable<{ msg: string, file: FileItem }> {
        const formData = new FormData();
        // 'articleFile' DOIT correspondre au champ attendu par Multer dans files.js
        formData.append('articleFile', file, file.name); 

        // L'intercepteur HTTP doit être configuré pour ajouter le token JWT ici
        return this.http.post<{ msg: string, file: FileItem }>(`${API_BASE_URL}/files/upload`, formData);
    }

    // Si vous aviez besoin de récupérer les fichiers de l'utilisateur connecté :
    // getMyFiles(): Observable<FileItem[]> {
    //     return this.http.get<FileItem[]>(`${API_BASE_URL}/files`);
    // }
}