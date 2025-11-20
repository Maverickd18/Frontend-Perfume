import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SellerService } from '../../services/seller.service';

@Component({
  selector: 'app-seller-profile',
  templateUrl: './seller-profile.page.html',
  styleUrls: ['./seller-profile.page.scss'],
  standalone: false
})
export class SellerProfilePage implements OnInit {
  user: any = null;
  
  stats = {
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private sellerService: SellerService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
    this.loadStats();
  }

  loadUserProfile() {
    this.user = this.authService.getCurrentUser();
  }

  loadStats() {
    // TODO: Implementar llamada al backend para obtener estadísticas del seller
    this.stats = {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalRevenue: 0
    };
  }

  goToProducts() {
    this.router.navigate(['/seller']);
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }

  onBackClick() {
    this.router.navigate(['/seller']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
