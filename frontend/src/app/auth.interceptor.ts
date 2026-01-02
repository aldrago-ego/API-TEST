// src/app/auth.interceptor.ts (Version simple et correcte)

import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

// src/app/auth.interceptor.ts
// ...
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const token = localStorage.getItem('token');
    if (token) {
        const authReq = req.clone({
            // CHANGER 'Authorization' pour 'x-auth-token'
            headers: req.headers.set('x-auth-token', token) 
            // Note: On n'ajoute PAS 'Bearer ' ici car le backend ne le gère pas dans sa version actuelle.
        });
        // ...
        return next(authReq);
    }
    return next(req);
};