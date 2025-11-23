import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  standalone: false
})
export class ProductDetailPage implements OnInit {
  product: any;
  isFavorite: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private navCtrl: NavController,
    private cartService: CartService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    this.product = history.state.product;
    if (this.product) {
      this.favoritesService.isFavorited(this.product.id).subscribe(
        isFavorited => {
          this.isFavorite = isFavorited;
        }
      );
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
    alert('Carrito de compras');
  }

  logout() {
    alert('Sesión cerrada');
    this.navCtrl.navigateRoot('/login');
  }

  toggleFavorite() {
    this.favoritesService.toggleFavorite(this.product).subscribe(
      isFavorited => {
        this.isFavorite = isFavorited;
      }
    );
  }

  addToCart() {
    this.cartService.addToCart(this.product);
    alert('Producto agregado al carrito: ' + this.product.title);
  }
}
