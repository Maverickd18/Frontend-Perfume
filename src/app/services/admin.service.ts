import { Injectable } from '@angular/core';
<<<<<<< HEAD

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeUsers: number;
  pendingStores: number;
  pendingOrders: number;
=======
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
>>>>>>> 41607925e492db535f124d8cc06bb883e597727a
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
<<<<<<< HEAD
  estado: 'activo' | 'bloqueado' | 'pendiente';
  tipoUsuario: 'cliente' | 'vendedor' | 'admin';
=======
  tipoUsuario: string;
  estado: string;
>>>>>>> 41607925e492db535f124d8cc06bb883e597727a
  fechaRegistro: string;
  tienda?: string;
  ordenes: number;
}

export interface Store {
  id: number;
  nombre: string;
  propietario: string;
  email: string;
<<<<<<< HEAD
  telefono: string;
  descripcion: string;
  estado: 'verificada' | 'pendiente' | 'suspendida';
  productosActivos: number;
  ventasMes: number;
  calificacion: number;
=======
  descripcion: string;
  productosActivos: number;
  ventasMes: number;
  calificacion: number;
  estado: string;
>>>>>>> 41607925e492db535f124d8cc06bb883e597727a
  fechaCreacion: string;
}

export interface Order {
  id: number;
  numero: string;
  cliente: string;
  tienda: string;
  total: number;
<<<<<<< HEAD
  estado: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
  fecha: string;
  productos: number;
=======
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
>>>>>>> 41607925e492db535f124d8cc06bb883e597727a
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
<<<<<<< HEAD

  // Mock data - Usuarios
  private users: User[] = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '+34 666 123 456',
      estado: 'activo',
      tipoUsuario: 'vendedor',
      fechaRegistro: '2025-01-15',
      tienda: 'Perfumes Premium',
      ordenes: 45
    },
    {
      id: 2,
      nombre: 'María García',
      email: 'maria@example.com',
      telefono: '+34 666 234 567',
      estado: 'activo',
      tipoUsuario: 'cliente',
      fechaRegistro: '2025-01-20',
      ordenes: 12
    },
    {
      id: 3,
      nombre: 'Carlos López',
      email: 'carlos@example.com',
      telefono: '+34 666 345 678',
      estado: 'bloqueado',
      tipoUsuario: 'vendedor',
      fechaRegistro: '2025-02-01',
      tienda: 'Aromas del Mundo',
      ordenes: 3
    },
    {
      id: 4,
      nombre: 'Ana Martínez',
      email: 'ana@example.com',
      telefono: '+34 666 456 789',
      estado: 'activo',
      tipoUsuario: 'cliente',
      fechaRegistro: '2025-02-10',
      ordenes: 28
    }
  ];

  // Mock data - Tiendas
  private stores: Store[] = [
    {
      id: 1,
      nombre: 'Perfumes Premium',
      propietario: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '+34 666 123 456',
      descripcion: 'Tienda de perfumes de lujo importados',
      estado: 'verificada',
      productosActivos: 45,
      ventasMes: 15000,
      calificacion: 4.8,
      fechaCreacion: '2025-01-15'
    },
    {
      id: 2,
      nombre: 'Aromas Naturales',
      propietario: 'Laura Fernández',
      email: 'laura@example.com',
      telefono: '+34 666 567 890',
      descripcion: 'Perfumes y colonias naturales',
      estado: 'pendiente',
      productosActivos: 23,
      ventasMes: 5000,
      calificacion: 0,
      fechaCreacion: '2025-02-20'
    },
    {
      id: 3,
      nombre: 'Fragancias del Mundo',
      propietario: 'Miguel Sánchez',
      email: 'miguel@example.com',
      telefono: '+34 666 678 901',
      descripcion: 'Colección de fragancias internacionales',
      estado: 'verificada',
      productosActivos: 67,
      ventasMes: 22000,
      calificacion: 4.9,
      fechaCreacion: '2025-01-05'
    }
  ];

  // Mock data - Pedidos
  private orders: Order[] = [
    {
      id: 1,
      numero: 'ORD-001',
      cliente: 'María García',
      tienda: 'Perfumes Premium',
      total: 250.50,
      estado: 'entregado',
      fecha: '2025-03-01',
      productos: 2
    },
    {
      id: 2,
      numero: 'ORD-002',
      cliente: 'Ana Martínez',
      tienda: 'Fragancias del Mundo',
      total: 180.00,
      estado: 'enviado',
      fecha: '2025-03-02',
      productos: 1
    },
    {
      id: 3,
      numero: 'ORD-003',
      cliente: 'Carlos López',
      tienda: 'Aromas Naturales',
      total: 95.99,
      estado: 'procesando',
      fecha: '2025-03-03',
      productos: 3
    },
    {
      id: 4,
      numero: 'ORD-004',
      cliente: 'Juan Pérez',
      tienda: 'Perfumes Premium',
      total: 320.00,
      estado: 'pendiente',
      fecha: '2025-03-04',
      productos: 2
    }
  ];

  constructor() { }

  // ============= DASHBOARD =============
  getDashboardStats(): DashboardStats {
    return {
      totalUsers: this.users.length,
      totalStores: this.stores.length,
      totalOrders: this.orders.length,
      totalRevenue: 87250.50,
      monthlyRevenue: 42500.75,
      activeUsers: this.users.filter(u => u.estado === 'activo').length,
      pendingStores: this.stores.filter(s => s.estado === 'pendiente').length,
      pendingOrders: this.orders.filter(o => o.estado === 'pendiente').length
    };
  }

  // ============= USERS =============
  getUsers(): User[] {
    return this.users;
  }

  banUser(userId: number): void {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.estado = 'bloqueado';
    }
  }

  unbanUser(userId: number): void {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.estado = 'activo';
    }
  }

  // ============= STORES =============
  getStores(): Store[] {
    return this.stores;
  }

  verifyStore(storeId: number): void {
    const store = this.stores.find(s => s.id === storeId);
    if (store) {
      store.estado = 'verificada';
    }
  }

  suspendStore(storeId: number): void {
    const store = this.stores.find(s => s.id === storeId);
    if (store) {
      store.estado = 'suspendida';
    }
  }

  // ============= ORDERS =============
  getOrders(): Order[] {
    return this.orders;
  }

  updateOrderStatus(orderId: number, newStatus: string): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.estado = newStatus as any;
    }
  }

  // ============= PRODUCTS =============
  deleteProduct(productId: number): void {
    // Mock implementation
    console.log(`Producto ${productId} eliminado`);
  }

}
=======
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
>>>>>>> 41607925e492db535f124d8cc06bb883e597727a
