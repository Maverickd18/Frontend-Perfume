import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  brandName: string;
  sizeMl: number;
  quantity: number;
  perfumeId?: number;
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
    const productId = product.id;
    
    // Buscar si el producto ya está en el carrito
    const existingItemIndex = currentCart.findIndex(item => item.id === productId);

    if (existingItemIndex > -1) {
      // Si ya existe, aumentar la cantidad
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      // Si no existe, agregar nuevo item
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        brandName: product.brandName,
        sizeMl: product.sizeMl,
        quantity: quantity,
        perfumeId: product.id
      };
      currentCart.push(cartItem);
    }

    this.cartItems$.next([...currentCart]);
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
    const itemIndex = currentCart.findIndex(i => i.id === productId);
    
    if (itemIndex > -1) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        currentCart[itemIndex].quantity = quantity;
        this.cartItems$.next([...currentCart]);
        this.saveCartToLocalStorage();
        this.updateCartCount();
      }
    }
  }

  clearCart(): void {
    this.cartItems$.next([]);
    localStorage.removeItem('cart');
    this.updateCartCount();
  }

  getCartTotal(): number {
    return this.cartItems$.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartSubtotal(): number {
    return this.getCartTotal();
  }

  getCart(): Observable<{ items: CartItem[], total: number }> {
    return new Observable(observer => {
      const items = this.cartItems$.value;
      const total = this.getCartTotal();
      observer.next({ items, total });
      observer.complete();
    });
  }

  // Método para obtener los items formateados para el checkout
  getCheckoutItems(): any[] {
    return this.cartItems$.value.map(item => ({
      perfumeId: item.id,
      quantity: item.quantity
    }));
  }
}