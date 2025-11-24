import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
}

export interface CheckoutRequest {
  items: Array<{
    perfumeId: number;
    quantity: number;
  }>;
  shippingAddress: string;
  billingAddress: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
}

export interface OrderResponse {
  status: string;
  message: string;
  data: {
    orderId: number;
    orderNumber: string;
    status: string;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    paymentUrl?: string;
    clientSecret?: string;
    items: any[];
    createdAt: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  processOrder(checkoutData: CheckoutRequest): Observable<OrderResponse> {
    const url = `${this.baseUrl}/api/orders/checkout`;
    const headers = this.getHeaders();
    
    console.log('Sending checkout data:', checkoutData);
    
    return this.http.post<OrderResponse>(url, checkoutData, { headers }).pipe(
      map(response => {
        console.log('Checkout response:', response);
        return response;
      })
    );
  }

  calculateShipping(address: ShippingAddress): Observable<{ shipping: number; tax: number }> {
    // Cálculo simple - puedes ajustar según tu lógica de negocio
    const shipping = 50; // Costo fijo de envío
    const tax = 0.16; // 16% IVA
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ shipping, tax });
        observer.complete();
      }, 500);
    });
  }

  confirmPayment(paymentIntentId: string): Observable<any> {
    const url = `${this.baseUrl}/api/orders/confirm-payment`;
    const headers = this.getHeaders();
    
    return this.http.post(url, { paymentIntentId }, { headers });
  }

  simulatePayment(paymentId: string, success: boolean = true): Observable<any> {
    const url = `${this.baseUrl}/api/payments/simulate-payment?payment_id=${paymentId}&success=${success}`;
    return this.http.get(url);
  }

  getOrderStatus(orderNumber: string): Observable<any> {
    const url = `${this.baseUrl}/api/orders/${orderNumber}`;
    const headers = this.getHeaders();
    
    return this.http.get(url, { headers });
  }

  getUserOrders(): Observable<any> {
    const url = `${this.baseUrl}/api/orders/my-orders`;
    const headers = this.getHeaders();
    
    return this.http.get(url, { headers });
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
}