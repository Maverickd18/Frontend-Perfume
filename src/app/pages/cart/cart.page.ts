import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: false
})
export class CartPage implements OnInit {
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  tax: number = 0;
  total: number = 0;
  TAX_RATE = 0.19;

  constructor(
    private navCtrl: NavController,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCartItems().subscribe(
      items => {
        this.cartItems = items;
        this.calculateTotals();
      }
    );
  }

  calculateTotals() {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.tax = this.subtotal * this.TAX_RATE;
    this.total = this.subtotal + this.tax;
  }

  updateQuantity(item: CartItem, newQuantity: number) {
    this.cartService.updateQuantity(item.id, newQuantity);
    this.calculateTotals();
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
    this.calculateTotals();
  }

  continueShopping() {
    this.navCtrl.navigateBack('/home');
  }

  checkout() {
    if (this.total > 0) {
      this.navCtrl.navigateForward('/checkout');
    }
  }

  goHome() {
    this.navCtrl.navigateRoot('/home');
  }

  onCartClick() {
    // Already on cart page
  }

  goProfile() {
    this.navCtrl.navigateForward('/profile-client');
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    this.navCtrl.navigateRoot('/login');
  }
}
