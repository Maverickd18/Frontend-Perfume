import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = this.authService.getUserData();
    const expectedRoles = route.data['roles'] as Array<string>;

    console.log('RoleGuard - Usuario:', user);
    console.log('RoleGuard - Roles esperados:', expectedRoles);

    if (user && user.rol && expectedRoles.includes(user.rol)) {
      return true;
    } else {
      this.redirectByRole(user?.rol);
      return false;
    }
  }

  private redirectByRole(rol: string | undefined) {
    console.log('RoleGuard - Redirigiendo por rol:', rol);
    
    // Si no hay rol definido, redirigir al home
    if (!rol) {
      this.router.navigate(['/home']);
      return;
    }
    
    switch (rol.toUpperCase()) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'VENDEDOR':
        this.router.navigate(['/seller']);
        break;
      case 'CLIENTE':
        this.router.navigate(['/home']);
        break;
      default:
        this.router.navigate(['/home']);
        break;
    }
  }
}