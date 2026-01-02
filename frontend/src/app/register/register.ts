import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerData = { name: '', email: '', password: '' };
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    this.errorMessage = ''; 

    this.authService.register(this.registerData).subscribe({
      next: (res) => {
        this.authService.saveAuthData(res.token, res.user);
        this.router.navigate(['/accueil']); 
      },
      error: (err) => {
        this.errorMessage = err.error?.msg || 'Échec de l\'inscription.';
      }
    });
  }

}
