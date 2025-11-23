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
  // Nuevos campos para vendedores
  totalSellers: number;
  activeSellers: number;
  conversionRate: number;
  avgRating: number;
  productsPerSeller: number;
  // Nuevos campos para clientes
  totalCustomers: number;
  activeCustomers: number;
  monthlyPurchases: number;
  avgOrderValue: number;
  repeatCustomers: number;
  // Perfumes
  totalPerfumes: number;
  // Vendedores - Detalles
  sellerRevenue: number;
  sellerProductCount: number;
  // Clientes - Detalles
  customerSpending: number;
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
  name: string;
  description: string;
  countryOrigin: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Perfume {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  sizeMl: number;
  genre: string;
  releaseDate?: string;
  brand: { id: number; name: string };
  category: { id: number; name: string };
  creador?: string;
}

export interface PerfumeDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
  sizeMl: number;
  genre: string;
  releaseDate?: string;
  brandId: number;
  categoryId: number;
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
            totalRevenue: 0,
            totalSellers: 0,
            activeSellers: 0,
            conversionRate: 0,
            avgRating: 0,
            productsPerSeller: 0,
            totalCustomers: 0,
            activeCustomers: 0,
            monthlyPurchases: 0,
            avgOrderValue: 0,
            repeatCustomers: 0,
            totalPerfumes: 0,
            sellerRevenue: 0,
            sellerProductCount: 0,
            customerSpending: 0
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
    return this.http.get<any>(`${this.API_URL}/perfumes?page=${page}&size=${size}`)
      .pipe(
        map(response => response?.data || []),
        catchError(error => {
          console.error('Error loading perfumes:', error);
          return of([]);
        })
      );
  }

  createPerfume(perfumeDto: PerfumeDTO): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/perfumes/nuevo`, perfumeDto)
      .pipe(
        catchError(error => {
          console.error('Error creating perfume:', error);
          throw error;
        })
      );
  }

  deletePerfume(perfumeId: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/perfumes/${perfumeId}`)
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

  createBrand(brand: Partial<Brand>): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/brands`, brand)
      .pipe(
        catchError(error => {
          console.error('Error creating brand:', error);
          throw error;
        })
      );
  }

  updateBrand(id: number, brand: Partial<Brand>): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/brands/${id}`, brand)
      .pipe(
        catchError(error => {
          console.error('Error updating brand:', error);
          throw error;
        })
      );
  }

  deleteBrand(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/brands/${id}`)
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

  createCategory(category: Partial<Category>): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/categories`, category)
      .pipe(
        catchError(error => {
          console.error('Error creating category:', error);
          throw error;
        })
      );
  }

  updateCategory(id: number, category: Partial<Category>): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/categories/${id}`, category)
      .pipe(
        catchError(error => {
          console.error('Error updating category:', error);
          throw error;
        })
      );
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/categories/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting category:', error);
          throw error;
        })
      );
  }
}
