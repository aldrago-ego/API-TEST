import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { FileItem, FileService } from '../file.service';
import { HttpErrorResponse } from '@angular/common/http';

interface ArticleFile { _id: string; originalName: string; uploadDate: string; filePath: string; }

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [FormsModule, CommonModule,DatePipe,NgIf,NgFor],
  templateUrl: './article.html',
  styleUrl: './article.css',
})
export class Article implements OnInit {
  files: FileItem[] = [];
    // Propriétés d'upload à supprimer :
    // selectedFile: File | null = null;
    // uploading = false;
    errorMessage: string | null = null;
    // successMessage: string | null = null; // Peut être conservé pour les messages de l'API

    constructor(private fileService: FileService) { }

    ngOnInit(): void {
        this.loadPublicFiles();
    }

    /**
     * Charge les fichiers publics depuis l'API. (CONSERVÉE)
     */
    loadPublicFiles(): void {
        this.fileService.getPublicFiles().subscribe({
            next: (data: FileItem[]) => {
                this.files = data;
                this.errorMessage = null; // Réinitialise l'erreur si la récupération réussit
            },
            error: (err: HttpErrorResponse) => {
                console.error('Erreur lors du chargement des fichiers:', err);
                this.errorMessage = 'Impossible de charger la liste des fichiers.';
            }
        });
    }

    // Méthodes d'upload à supprimer :
    // onFileSelected(event: any): void { ... }
    // onUpload(): void { ... }

    /**
     * Ouvre le lien public du fichier dans un nouvel onglet. (CONSERVÉE)
     */
    openFile(file: FileItem): void {
        // Utilise le champ 'publicUrl' que le backend va maintenant renvoyer
        if (file.publicUrl) {
            window.open(file.publicUrl, '_blank');
        } else {
            this.errorMessage = 'Lien de fichier introuvable. Veuillez réessayer.';
        }
    }
}
