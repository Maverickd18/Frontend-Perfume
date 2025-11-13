import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as Array<string>;
    const user = this.authService.getCurrentUser();

    console.log('RoleGuard - User:', user);
    console.log('RoleGuard - Expected roles:', expectedRoles);

    // Cambiar user.rol por user.role
    if (user && user.role && expectedRoles.includes(user.role)) {
      return true;
    }

    // Redirigir según el rol actual del usuario
    this.redirectByRole(user?.role);
    return false;
  }

  private redirectByRole(role?: string): void {
    switch (role) {
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
        this.router.navigate(['/login']);
        break;
    }
  }
}