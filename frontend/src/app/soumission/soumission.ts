import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule, NgIf } from '@angular/common';


@Component({
  selector: 'app-soumission',
  imports: [CommonModule, NgIf],
  standalone: true, // Ajoutez standalone: true si ce n'est pas fait
  templateUrl: './soumission.html',
  styleUrl: './soumission.css',
})
export class Soumission {
    selectedFile: File | null = null;
    uploading: boolean = false;
    uploadSuccess: boolean = false;
    errorMessage: string = '';
    
    // Durée en millisecondes avant la redirection
    private REDIRECT_DELAY_MS = 3000; 

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    /**
     * Déclenchée lors de la sélection d'un fichier via l'input
     */
    onFileSelected(event: any): void {
        this.selectedFile = null;
        this.uploadSuccess = false;
        this.errorMessage = '';

        const fileList: FileList = event.target.files;
        if (fileList && fileList.length > 0) {
            const file = fileList[0];
            
            if (file.type === 'application/pdf') {
                this.selectedFile = file;
            } else {
                this.errorMessage = 'Format non supporté. Veuillez sélectionner un fichier PDF.';
                event.target.value = null; 
            }
        }
    }

    /**
     * Soumission du fichier (appel API)
     */
    onUpload(): void {
        if (!this.selectedFile) {
            this.errorMessage = 'Veuillez sélectionner un fichier à télécharger.';
            return;
        }

        this.uploading = true;
        this.errorMessage = '';

        this.authService.uploadFile(this.selectedFile).subscribe({
            next: (res) => {
                this.uploading = false;
                this.uploadSuccess = true;
                this.errorMessage = ''; 
                
                console.log("Upload réussi:", res.msg); 
                
                // 🚨 NOUVELLE LOGIQUE : Redirection après un délai
                setTimeout(() => {
                    // Si vous avez un chemin différent, remplacez '/article'
                    this.router.navigate(['/article']); 
                }, this.REDIRECT_DELAY_MS);

                // NOTE: Nous ne réinitialisons PAS 'selectedFile' immédiatement 
                // pour que le nom s'affiche dans le message de succès.
            },
            error: (err) => {
                this.uploading = false;
                this.uploadSuccess = false; // Assurez-vous que le succès est désactivé en cas d'erreur
                this.errorMessage = err.error?.msg || 'Échec du téléchargement. Veuillez réessayer.';
                console.error("Erreur d'upload:", err);
            }
        });
    }
}