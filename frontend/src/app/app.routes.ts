import { Routes } from '@angular/router';
import { Article } from './article/article';
import { Membres } from './membres/membres';
import { Accueil } from './accueil/accueil';
import { Layout } from './layout/layout';
import { Login } from './login/login';
import { Acces } from './acces/acces';
import { Register } from './register/register';
import { Soumission } from './soumission/soumission';
import { authGuard } from './auth.garde';

export const routes: Routes = [
    
    // -------------------------------------------------------------------
    // A. ROUTES SANS LAYOUT (Access et Login)
    // -------------------------------------------------------------------

    // 1. Redirection de la racine ('/') vers la page d'accès ('/acces')
    { path: '', redirectTo: 'acces', pathMatch: 'full' }, 

    // 2. La Page d'Accès (Votre nouveau portail)
    {
        path: 'acces',
        component: Acces,
    },
    
    // 3. La Page de Connexion (pour le comité)
    {
        path: 'login',
        component: Login, 
    },
    {
        path: 'register',
        component: Register,
    },
    {
        path: 'soumission',
        component: Soumission,
        canActivate: [authGuard],
    },

    // -------------------------------------------------------------------
    // B. ROUTE PARENTE : PAGES PRINCIPALES (AVEC LAYOUT)
    // -------------------------------------------------------------------
    {
        path: '', // Cette route agit comme conteneur pour le Layout
        component: Layout,
        children: [
            
            // a. Route par défaut pour le Layout (redirige vers 'accueil' si l'URL est juste /)
            // Cela gère le cas où l'utilisateur arrive sur une URL vide ayant le Layout.
            {
                path: '',
                redirectTo: 'accueil',
                pathMatch: 'full',
            },

            // b. Les routes de votre application avec le Layout
            {
                path: 'accueil',
                component: Accueil,
            },
            {
                path: 'article', // C'est l'ancienne 'Publications'
                component: Article,
            },
            {
                path: 'membres', // C'est l'ancienne 'Administration'
                // NOTE: Ce chemin devrait être protégé par un AuthGuard
                component: Membres, 
            },
            
            // c. Redirection Wildcard pour les erreurs DANS LE LAYOUT
            // Tout ce qui n'est pas trouvé est renvoyé vers le point d'entrée
            {
                path: '**',
                redirectTo: 'acces', 
            }
        ]
    },
];