import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { 
  NavController, 
  IonicModule, 
  ToastController,
  AlertController 
} from '@ionic/angular';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class ProductDetailPage implements OnInit {
  product: any = null;
  isFavorite: boolean = false;
  isLoading: boolean = true;
  productId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private navCtrl: NavController,
    private cartService: CartService,
    private favoritesService: FavoritesService,
    private productService: ProductService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Obtener el ID de la ruta si existe
    this.productId = this.route.snapshot.paramMap.get('id');
    
    // Intentar cargar el producto desde el state primero (más rápido)
    this.product = history.state.product;
    
    if (this.product) {
      // Si tenemos el producto en el state, usarlo directamente
      this.checkFavoriteStatus();
      this.isLoading = false;
      console.log('Product loaded from state:', this.product);
    } else if (this.productId) {
      // Si no hay state pero tenemos ID, cargar desde la API
      this.loadProduct(parseInt(this.productId));
    } else {
      // Si no hay ni state ni ID, mostrar error
      this.isLoading = false;
      this.showError('Producto no encontrado');
    }
  }

  private loadProduct(id: number) {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.checkFavoriteStatus();
        this.isLoading = false;
        console.log('Product loaded from API:', product);
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.isLoading = false;
        this.showError('Error al cargar el producto');
      }
    });
  }

  private checkFavoriteStatus() {
    if (this.product && this.product.id) {
      this.favoritesService.isFavorited(this.product.id).subscribe({
        next: (isFavorited) => {
          this.isFavorite = isFavorited;
        },
        error: (error) => {
          console.error('Error checking favorite status:', error);
        }
      });
    }
  }

  async addToCart() {
    if (!this.product) {
      this.showError('Producto no disponible');
      return;
    }

    if (this.product.stock <= 0) {
      this.showError('Producto sin stock disponible');
      return;
    }

    try {
      this.cartService.addToCart(this.product, 1);
      await this.showToast(`"${this.product.name}" agregado al carrito`, 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      this.showError('Error al agregar al carrito');
    }
  }

  toggleFavorite() {
    if (this.product) {
      this.favoritesService.toggleFavorite(this.product).subscribe({
        next: (isFavorited) => {
          this.isFavorite = isFavorited;
          const message = isFavorited ? 'Agregado a favoritos' : 'Removido de favoritos';
          this.showToast(message, 'success');
        },
        error: (error) => {
          console.error('Error toggling favorite:', error);
          this.showError('Error al actualizar favoritos');
        }
      });
    }
  }

  goBack() {
    this.location.back();
  }

  goHome() {
    this.navCtrl.navigateRoot('/home');
  }

  goProfile() {
    this.navCtrl.navigateForward('/profile-client');
  }

  onCartClick() {
    this.router.navigate(['/cart']);
  }

  goToCheckout() {
    if (this.product) {
      // Agregar al carrito y luego ir al checkout
      this.cartService.addToCart(this.product, 1);
      this.router.navigate(['/checkout']);
    }
  }

  logout() {
    this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          handler: () => {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            this.navCtrl.navigateRoot('/login');
          }
        }
      ]
    }).then(alert => alert.present());
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

  private async showError(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: 'danger',
      position: 'top'
    });
    await toast.present();
  }
}