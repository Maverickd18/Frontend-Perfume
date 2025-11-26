import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userJson = localStorage.getItem('currentUser');
    
    if (!userJson) {
      console.warn('AdminGuard: No user found, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const user = JSON.parse(userJson);
      
      // Verificar si es admin (soportar ambos formatos)
      const isAdmin = user?.role === 'ADMIN' || 
                     user?.role === 'admin' ||
                     user?.roles?.includes('ADMIN') ||
                     user?.roles?.includes('admin');
      
      if (isAdmin) {
        console.log('AdminGuard: Access granted for admin user');
        return true;
      }
      
      console.warn('AdminGuard: User is not admin, redirecting to home');
      this.router.navigate(['/home']);
      return false;
    } catch (error) {
      console.error('AdminGuard: Error parsing user data', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
