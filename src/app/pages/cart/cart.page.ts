import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: false
})
export class CartPage implements OnInit {
  cartItems: any[] = [];
  subtotal: number = 0;
  tax: number = 0;
  total: number = 0;

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
    this.tax = this.subtotal * 0.19;
    this.total = this.subtotal + this.tax;
  }

  updateQuantity(item: any, newQuantity: number) {
    if (newQuantity <= 0) {
      this.removeItem(item.id);
    } else {
      item.quantity = newQuantity;
      this.cartService.updateCart(this.cartItems).subscribe(
        () => this.calculateTotals()
      );
    }
  }

  removeItem(productId: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.cartService.updateCart(this.cartItems).subscribe(
      () => this.calculateTotals()
    );
  }

  goHome() {
    this.navCtrl.navigateRoot('/home');
  }

  goProfile() {
    this.navCtrl.navigateForward('/profile-client');
  }

  logout() {
    this.navCtrl.navigateRoot('/login');
  }

  onCartClick() {
    // Ya estamos en el carrito
  }

  checkout() {
    alert('Proceeding to checkout with total: $' + this.total.toFixed(2));
    // TODO: Implementar pago
  }

  continueShopping() {
    this.navCtrl.navigateRoot('/home');
  }
}
