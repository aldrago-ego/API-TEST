import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginData = {
    email: '',
    password: ''
  };
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    this.errorMessage = ''; 

    // Appel à la méthode login du service
    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        // Succès : Sauvegarde des données et redirection
        this.authService.saveAuthData(res.token, res.user);
        this.router.navigate(['/soumission']); // Redirection après connexion réussie
      },
      error: (err) => {
        // Erreur : Affichage du message renvoyé par le backend
        this.errorMessage = err.error?.msg || 'Erreur de connexion.';
      }
    });
  }

}
