// src/app/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces pour définir la structure des données (bonne pratique TypeScript)
interface UserRegistration {
    name: string;
    email: string;
    password: string;
}

interface AuthResponse {
    token: string;
    user: {
        name: string;
        email: string;
    };
}

// URL de base de votre backend
const API_BASE_URL = 'http://localhost:3000/api'; 

@Injectable({
  providedIn: 'root' // Le service est disponible globalement dans l'application
})
export class AuthService {

  constructor(private http: HttpClient) { }


  
  /**
   * Envoie les données d'inscription au backend (POST /api/auth/register)
   */
  register(user: UserRegistration): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/register`, user);
  }

  login(credentials: { email: string, password: string }): Observable<any> { 
    return this.http.post<any>(`${API_BASE_URL}/auth/login`, credentials);
  }

 getPublicFiles(): Observable<any> {
    // Génère un timestamp unique (cache buster)
    const timestamp = new Date().getTime(); 
    
    // Ajout du paramètre ?t=timestamp à la fin de l'URL
    const urlWithCacheBuster = `${API_BASE_URL}/files/public?t=${timestamp}`;

    return this.http.get<any>(urlWithCacheBuster);
  }
  
uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('articleFile', file, file.name);

    // L'intercepteur ajoute déjà le token automatiquement
    return this.http.post<any>(`${API_BASE_URL}/files/upload`, formData);
}

  /**
   * Sauvegarde le token JWT et les infos utilisateur dans le localStorage.
   */
  saveAuthData(token: string, user: { name: string, email: string }): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  // La méthode login sera ajoutée plus tard
  // login(credentials: any): Observable<any> { ... }
}