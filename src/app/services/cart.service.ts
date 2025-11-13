import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = environment.apiUrl;
  private cartItems$ = new BehaviorSubject<any[]>([]);
  private cartCount$ = new BehaviorSubject<number>(0);

  constructor() {}

  getCartItems(): Observable<any[]> {
    return this.cartItems$.asObservable();
  }

  getCartCount(): Observable<number> {
    return this.cartCount$.asObservable();
  }

  addToCart(product: any): Observable<any> {
    return new Observable(observer => {
      observer.next({ success: true, message: 'Producto agregado al carrito' });
      observer.complete();
    });
  }

  removeFromCart(productId: number): Observable<any> {
    return new Observable(observer => {
      observer.next({ success: true, message: 'Producto removido del carrito' });
      observer.complete();
    });
  }

  updateQuantity(productId: number, quantity: number): Observable<any> {
    return new Observable(observer => {
      observer.next({ success: true, message: 'Cantidad actualizada' });
      observer.complete();
    });
  }

  clearCart(): Observable<any> {
    return new Observable(observer => {
      observer.next({ success: true, message: 'Carrito vaciado' });
      observer.complete();
    });
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
