import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SellerService } from '../services/seller.service';

@Injectable({
  providedIn: 'root'
})
export class StoreGuard implements CanActivate {
  
  constructor(private sellerService: SellerService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const store = this.sellerService.getStore();
    
    // Si la tienda tiene nombre (fue creada), permite el acceso
    if (store.nombre && store.nombre.trim() !== '') {
      return true;
    }
    
    // Si no, redirige a seller (crear tienda) y bloquea el acceso
    this.router.navigate(['/seller']);
    return false;
  }
}
