import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CartItem {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  brand: string;
  size: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = environment.apiUrl;
  private cartItems$ = new BehaviorSubject<CartItem[]>([]);
  private cartCount$ = new BehaviorSubject<number>(0);

  constructor() {
    this.loadCartFromLocalStorage();
  }

  private loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        this.cartItems$.next(items);
        this.updateCartCount();
      } catch (e) {
        console.error('Error loading cart from localStorage', e);
      }
    }
  }

  private saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems$.value));
  }

  private updateCartCount() {
    const count = this.cartItems$.value.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCount$.next(count);
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$.asObservable();
  }

  getCartCount(): Observable<number> {
    return this.cartCount$.asObservable();
  }

  addToCart(product: any, quantity: number = 1): void {
    const currentCart = this.cartItems$.value;
    const existingItem = currentCart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const cartItem: CartItem = {
        ...product,
        quantity: quantity
      };
      currentCart.push(cartItem);
    }

    this.cartItems$.next(currentCart);
    this.saveCartToLocalStorage();
    this.updateCartCount();
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartItems$.value.filter(item => item.id !== productId);
    this.cartItems$.next(currentCart);
    this.saveCartToLocalStorage();
    this.updateCartCount();
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentCart = this.cartItems$.value;
    const item = currentCart.find(i => i.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.cartItems$.next(currentCart);
        this.saveCartToLocalStorage();
        this.updateCartCount();
      }
    }
  }

  clearCart(): void {
    this.cartItems$.next([]);
    this.saveCartToLocalStorage();
    this.updateCartCount();
  }

  getCart(): Observable<any> {
    return new Observable(observer => {
      observer.next({ items: [], total: 0 });
      observer.complete();
    });
  }

  checkout(orderData: any): Observable<any> {
    return new Observable(observer => {
      observer.next({ success: true, orderId: 'ORD-' + Date.now() });
      observer.complete();
    });
  }

  updateCart(items: any[]): Observable<any> {
    return new Observable(observer => {
      observer.next({ success: true, message: 'Carrito actualizado' });
      observer.complete();
    });
  }
}
