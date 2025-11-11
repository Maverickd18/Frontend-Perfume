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

export interface Brand {
  id: number;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface Perfume {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  marca?: string;
  categoria?: string;
  activo?: boolean;
  fechaCreacion?: string;
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
  getPerfumes(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.API_URL}/perfumes?page=${page}&size=${size}`)
      .pipe(
        catchError(error => {
          console.error('Error loading perfumes:', error);
          return of([]);
        })
      );
  }

  getPerfumesBySearch(filtro: string, page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.API_URL}/perfumes/mis-perfumes?filtro=${filtro}&page=${page}&size=${size}`)
      .pipe(
        catchError(error => {
          console.error('Error searching perfumes:', error);
          return of([]);
        })
      );
  }

  deletePerfume(perfumeId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/perfumes/${perfumeId}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting perfume:', error);
          throw error;
        })
      );
  }

  // Marcas
  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.API_URL}/brands`)
      .pipe(
        catchError(error => {
          console.error('Error loading brands:', error);
          return of([]);
        })
      );
  }

  createBrand(brand: Partial<Brand>): Observable<Brand> {
    return this.http.post<Brand>(`${this.API_URL}/brands`, brand)
      .pipe(
        catchError(error => {
          console.error('Error creating brand:', error);
          throw error;
        })
      );
  }

  updateBrand(id: number, brand: Partial<Brand>): Observable<Brand> {
    return this.http.put<Brand>(`${this.API_URL}/brands/${id}`, brand)
      .pipe(
        catchError(error => {
          console.error('Error updating brand:', error);
          throw error;
        })
      );
  }

  deleteBrand(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/brands/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting brand:', error);
          throw error;
        })
      );
  }

  // Categorías
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/categories`)
      .pipe(
        catchError(error => {
          console.error('Error loading categories:', error);
          return of([]);
        })
      );
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.API_URL}/categories`, category)
      .pipe(
        catchError(error => {
          console.error('Error creating category:', error);
          throw error;
        })
      );
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.API_URL}/categories/${id}`, category)
      .pipe(
        catchError(error => {
          console.error('Error updating category:', error);
          throw error;
        })
      );
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/categories/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting category:', error);
          throw error;
        })
      );
  }
}
