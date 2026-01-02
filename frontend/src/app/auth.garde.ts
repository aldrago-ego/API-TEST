// src/app/auth.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Vérifie si le token est présent dans le localStorage
  const token = localStorage.getItem('token');

  if (token) {
    // L'utilisateur est connecté, l'accès est autorisé
    return true;
  } else {
    // L'utilisateur n'est pas connecté
    alert("Vous devez être connecté pour soumettre un article.");
    
    // Redirige vers la page de connexion
    return router.createUrlTree(['/login']); 
  }
};