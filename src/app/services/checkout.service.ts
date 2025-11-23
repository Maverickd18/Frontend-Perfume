import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// ============================================
// INTERFACES DE DATOS
// ============================================

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
}

export interface PaymentMethod {
  type: 'card' | 'transfer' | 'cash_on_delivery';
  cardNumber?: string;
  cardHolderName?: string;
  expirationDate?: string;
  cvv?: string;
  transferReference?: string;
}

export interface OrderItem {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  size?: string;
  image?: string;
}

export interface CheckoutRequest {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  notes?: string;
}

export interface OrderResponse {
  orderId: string;
  status: string;
  message: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface PaymentValidationResponse {
  valid: boolean;
  message?: string;
}

// ============================================
// CONFIGURACIÓN DE ENDPOINTS
// ============================================
// Modifica estos endpoints según tu API real
const API_ENDPOINTS = {
  processOrder: '/api/orders/process',
  validatePayment: '/api/payments/validate',
  calculateShipping: '/api/shipping/calculate',
  getPaymentMethods: '/api/payments/methods',
  createOrder: '/api/orders/create',
  confirmPayment: '/api/payments/confirm'
};

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // ============================================
  // MÉTODO PRINCIPAL - PROCESAR ORDEN COMPLETA
  // ============================================
  /**
   * Procesa la orden completa incluyendo pago y envío
   * @param checkoutData - Datos completos del checkout
   * @returns Observable con la respuesta de la orden
   */
  processOrder(checkoutData: CheckoutRequest): Observable<OrderResponse> {
    const url = `${this.baseUrl}${API_ENDPOINTS.processOrder}`;
    const headers = this.getHeaders();
    
    return this.http.post<OrderResponse>(url, checkoutData, { headers });
  }

  // ============================================
  // CREAR ORDEN SIN PROCESAR PAGO
  // ============================================
  /**
   * Crea una orden sin procesar el pago
   * Útil para pagos en dos pasos o contraentrega
   */
  createOrder(checkoutData: CheckoutRequest): Observable<OrderResponse> {
    const url = `${this.baseUrl}${API_ENDPOINTS.createOrder}`;
    const headers = this.getHeaders();
    
    return this.http.post<OrderResponse>(url, checkoutData, { headers });
  }

  // ============================================
  // VALIDAR MÉTODO DE PAGO
  // ============================================
  /**
   * Valida los datos del método de pago antes de procesar
   * @param paymentMethod - Datos del método de pago
   */
  validatePayment(paymentMethod: PaymentMethod): Observable<PaymentValidationResponse> {
    const url = `${this.baseUrl}${API_ENDPOINTS.validatePayment}`;
    const headers = this.getHeaders();
    
    return this.http.post<PaymentValidationResponse>(url, paymentMethod, { headers });
  }

  // ============================================
  // CONFIRMAR PAGO
  // ============================================
  /**
   * Confirma el pago de una orden existente
   * @param orderId - ID de la orden
   * @param paymentMethod - Método de pago a confirmar
   */
  confirmPayment(orderId: string, paymentMethod: PaymentMethod): Observable<any> {
    const url = `${this.baseUrl}${API_ENDPOINTS.confirmPayment}`;
    const headers = this.getHeaders();
    
    return this.http.post<any>(url, { orderId, paymentMethod }, { headers });
  }

  // ============================================
  // CALCULAR COSTO DE ENVÍO
  // ============================================
  /**
   * Calcula el costo de envío según la dirección
   * @param address - Dirección de envío
   */
  calculateShipping(address: ShippingAddress): Observable<{ shipping: number; tax: number }> {
    const url = `${this.baseUrl}${API_ENDPOINTS.calculateShipping}`;
    const headers = this.getHeaders();
    
    return this.http.post<{ shipping: number; tax: number }>(url, address, { headers });
  }

  // ============================================
  // OBTENER MÉTODOS DE PAGO DISPONIBLES
  // ============================================
  /**
   * Obtiene los métodos de pago disponibles
   */
  getAvailablePaymentMethods(): Observable<any[]> {
    const url = `${this.baseUrl}${API_ENDPOINTS.getPaymentMethods}`;
    const headers = this.getHeaders();
    
    return this.http.get<any[]>(url, { headers });
  }

  // ============================================
  // UTILIDADES
  // ============================================
  
  /**
   * Genera los headers necesarios para las peticiones HTTP
   * Incluye el token de autenticación si existe
   */
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Agregar token de autenticación si existe
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Valida el formato de email
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida el formato de número de tarjeta
   */
  isValidCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleaned);
  }

  /**
   * Valida el CVV de la tarjeta
   */
  isValidCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
  }

  /**
   * Formatea el número de tarjeta con espacios
   */
  formatCardNumber(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, '');
    return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
  }

  /**
   * Obtiene el tipo de tarjeta según el número
   */
  getCardType(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'discover';
    
    return 'unknown';
  }
}
