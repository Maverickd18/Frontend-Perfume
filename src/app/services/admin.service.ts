import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalStores: number;
  pendingStores: number;
  totalOrders: number;
  pendingOrders: number;
  monthlyRevenue: number;
  totalRevenue: number;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  tipoUsuario: string;
  estado: string;
  fechaRegistro: string;
  tienda?: string;
  ordenes: number;
}

export interface Store {
  id: number;
  nombre: string;
  propietario: string;
  email: string;
  descripcion: string;
  productosActivos: number;
  ventasMes: number;
  calificacion: number;
  estado: string;
  fechaCreacion: string;
}

export interface Order {
  id: number;
  numero: string;
  cliente: string;
  tienda: string;
  total: number;
  productos: string;
  fecha: string;
  estado: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    nombre: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private API_URL = 'http://localhost:8080/api';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          // Guardar token y información del usuario
          localStorage.setItem('adminToken', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }),
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('currentUser');
    
    if (!token || !user) {
      return false;
    }


    return true;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    if (!user) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        return parsedUser.role === 'admin';
      }
      return false;
    }
    return user.role === 'admin';
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  // Dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.API_URL}/admin/dashboard`)
      .pipe(
        catchError(error => {
          console.error('Error loading dashboard:', error);
          // Retornar datos mock en caso de error
          return of({
            totalUsers: 0,
            activeUsers: 0,
            totalStores: 0,
            pendingStores: 0,
            totalOrders: 0,
            pendingOrders: 0,
            monthlyRevenue: 0,
            totalRevenue: 0
          });
        })
      );
  }

  // Usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/admin/users`)
      .pipe(
        catchError(error => {
          console.error('Error loading users:', error);
          return of([]);
        })
      );
  }

  banUser(userId: number): Observable<any> {
    return this.http.put(`${this.API_URL}/admin/users/${userId}/ban`, {})
      .pipe(
        catchError(error => {
          console.error('Error banning user:', error);
          throw error;
        })
      );
  }

  unbanUser(userId: number): Observable<any> {
    return this.http.put(`${this.API_URL}/admin/users/${userId}/unban`, {})
      .pipe(
        catchError(error => {
          console.error('Error unbanning user:', error);
          throw error;
        })
      );
  }

  // Tiendas
  getStores(): Observable<Store[]> {
    return this.http.get<Store[]>(`${this.API_URL}/admin/stores`)
      .pipe(
        catchError(error => {
          console.error('Error loading stores:', error);
          return of([]);
        })
      );
  }

  verifyStore(storeId: number): Observable<any> {
    return this.http.put(`${this.API_URL}/admin/stores/${storeId}/verify`, {})
      .pipe(
        catchError(error => {
          console.error('Error verifying store:', error);
          throw error;
        })
      );
  }

  suspendStore(storeId: number): Observable<any> {
    return this.http.put(`${this.API_URL}/admin/stores/${storeId}/suspend`, {})
      .pipe(
        catchError(error => {
          console.error('Error suspending store:', error);
          throw error;
        })
      );
  }

  // Pedidos
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.API_URL}/admin/orders`)
      .pipe(
        catchError(error => {
          console.error('Error loading orders:', error);
          return of([]);
        })
      );
  }

  updateOrderStatus(orderId: number, newStatus: string): Observable<any> {
    return this.http.put(`${this.API_URL}/admin/orders/${orderId}/status`, { estado: newStatus })
      .pipe(
        catchError(error => {
          console.error('Error updating order status:', error);
          throw error;
        })
      );
  }

  // Productos
  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/admin/products/${productId}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting product:', error);
          throw error;
        })
      );
  }

  // Perfumes
  getPerfumes(filtro?: string, page: number = 0, size: number = 10): Observable<any> {
    const params = filtro ? `?filtro=${filtro}&page=${page}&size=${size}` : `?page=${page}&size=${size}`;
    return this.http.get(`${this.API_URL}/perfumes${params}`);
  }
}