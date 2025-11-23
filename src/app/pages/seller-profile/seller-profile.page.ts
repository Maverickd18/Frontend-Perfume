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
  isEditing = false;
  
  userProfile = {
    username: 'Vendedor Pro',
    email: 'vendedor@perfumes.com',
    phone: '',
    company: '',
    address: '',
    bio: '',
    avatar: ''
  };

  originalProfile: any = {};
  
  stats = {
    totalProducts: 0,
    totalBrands: 0,
    totalSales: 0,
    rating: 0.0
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
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userProfile = {
        username: currentUser.username || 'Usuario',
        email: currentUser.email || '',
        phone: (currentUser as any).phone || '',
        company: (currentUser as any).company || '',
        address: (currentUser as any).address || '',
        bio: (currentUser as any).bio || '',
        avatar: (currentUser as any).avatar || ''
      };
      this.originalProfile = { ...this.userProfile };
    }
  }

  loadStats() {
    this.sellerService.getMyPerfumes().subscribe({
      next: (response) => {
        this.stats.totalProducts = response.data ? response.data.length : 0;
      },
      error: (error) => {
        console.error('Error loading perfumes:', error);
        this.stats.totalProducts = 0;
      }
    });

    this.sellerService.getMyBrands().subscribe({
      next: (brands) => {
        this.stats.totalBrands = Array.isArray(brands) ? brands.length : 0;
      },
      error: (error) => {
        console.error('Error loading brands:', error);
        this.stats.totalBrands = 0;
      }
    });

    // TODO: Implementar estadísticas reales
    this.stats.totalSales = 0;
    this.stats.rating = 0.0;
  }

  toggleEdit() {
    this.isEditing = true;
    this.originalProfile = { ...this.userProfile };
  }

  cancelEdit() {
    this.isEditing = false;
    this.userProfile = { ...this.originalProfile };
  }

  saveProfile() {
    // TODO: Implementar guardado en el backend
    console.log('Guardando perfil:', this.userProfile);
    this.isEditing = false;
    // Aquí podrías llamar a un servicio para guardar los datos
    // this.authService.updateProfile(this.userProfile).subscribe(...)
  }

  changeAvatar() {
    // TODO: Implementar cambio de avatar con upload de imagen
    console.log('Cambiar avatar');
  }

  changePassword() {
    // TODO: Implementar modal o navegación para cambiar contraseña
    console.log('Cambiar contraseña');
  }

  goToProducts() {
    this.router.navigate(['/seller']);
  }

  goToBrands() {
    this.router.navigate(['/seller']);
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onBackClick() {
    this.router.navigate(['/seller']);
  }
}
