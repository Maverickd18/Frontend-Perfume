import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// ========== INTERFACES ==========

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
  brand?: { id: number; name: string };
  category?: { id: number; name: string };
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

// Interfaces para gestión de usuarios
export interface UserManagement {
  id: number;
  username: string;
  email: string;
  enabled: boolean;
  role: string;
  createdAt: string;
  lastLogin?: string;
}

// Interfaces para moderación
export interface ModerationStats {
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
  approvalRate: number;
  avgReviewTime: number;
}

export interface PerfumeModeration {
  id: number;
  name: string;
  seller: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedDate: string;
  reviewDate?: string;
  rejectionReason?: string;
}

// Interfaces para órdenes
export interface OrderManagement {
  id: number;
  orderNumber: string;
  customer: string;
  seller: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: number;
  orderDate: string;
  lastUpdated: string;
}

// Interfaces para reportes
export interface SalesReport {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalOrders: number;
  period: string;
}

export interface SellerReport {
  id: number;
  name: string;
  email: string;
  totalSales: number;
  revenue: number;
  activeProducts: number;
  rating: number;
  nombre?: string;
  estado?: string;
  productCount?: number;
  totalRevenue?: number;
  orderCount?: number;
}

export interface ProductReport {
  id: number;
  name: string;
  seller: string;
  totalSold: number;
  revenue: number;
  rating: number;
}

export interface UserActivityReport {
  id: number;
  username: string;
  email: string;
  purchases: number;
  totalSpent: number;
  lastActivity: string;
  status: string;
  estado?: string;
  purchaseCount?: number;
  avgOrderValue?: number;
  monthlyPurchases?: number;
  name?: string;
  nombre?: string;
}

export interface SystemStats {
  uptime: number;
  totalRequests: number;
  activeConnections: number;
  cpuUsage: number;
  memoryUsage: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiBase = `${environment.apiUrl}/api`;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log('AdminService initialized with API base:', this.apiBase);
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  // ========== AUTHENTICATION ==========

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiBase}/auth/login`, { email, password })
      .pipe(
        tap(response => {
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
    return !!(token && user);
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

  // ========== DASHBOARD ==========

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiBase}/admin/dashboard`)
      .pipe(
        tap(response => console.log('Dashboard stats received:', response)),
        catchError(error => {
          console.error('Error loading dashboard:', error);
          return of({});
        })
      );
  }

  // ========== USERS ==========

  getUsers(page = 0, size = 50, search?: string): Observable<any> {
    let params = new HttpParams().set('page', String(page)).set('size', String(size));
    if (search) params = params.set('search', search);
    return this.http.get(`${this.apiBase}/admin/users`, { params })
      .pipe(
        tap(response => console.log('Users received:', response)),
        catchError(error => {
          console.error('Error loading users:', error);
          return of([]);
        })
      );
  }

  patchUserStatus(userId: number | string, enabled: boolean): Observable<any> {
    return this.http.patch(`${this.apiBase}/admin/users/${userId}/status`, { enabled })
      .pipe(
        tap(response => console.log('User status updated:', response)),
        catchError(error => {
          console.error('Error changing user status:', error);
          throw error;
        })
      );
  }

  patchUserRole(userId: number | string, role: string): Observable<any> {
    return this.http.patch(`${this.apiBase}/admin/users/${userId}/role`, { role })
      .pipe(
        tap(response => console.log('User role updated:', response)),
        catchError(error => {
          console.error('Error changing user role:', error);
          throw error;
        })
      );
  }

  changeUserStatus(userId: number | string, enabled: boolean): Observable<any> {
    return this.patchUserStatus(userId, enabled);
  }

  changeUserRole(userId: number | string, role: string): Observable<any> {
    return this.patchUserRole(userId, role);
  }

  searchUsers(term: string): Observable<any> {
    return this.getUsers(0, 50, term);
  }

  banUser(userId: number | string): Observable<any> {
    return this.http.post(`${this.apiBase}/admin/users/${userId}/ban`, {})
      .pipe(
        tap(response => console.log('User banned:', response)),
        catchError(error => {
          console.error('Error banning user:', error);
          throw error;
        })
      );
  }

  unbanUser(userId: number | string): Observable<any> {
    return this.http.post(`${this.apiBase}/admin/users/${userId}/unban`, {})
      .pipe(
        tap(response => console.log('User unbanned:', response)),
        catchError(error => {
          console.error('Error unbanning user:', error);
          throw error;
        })
      );
  }

  // ========== PERFUMES ==========

  getPendingPerfumes(): Observable<any> {
    return this.http.get(`${this.apiBase}/perfumes/admin/pendientes`)
      .pipe(
        tap(response => console.log('Pending perfumes received:', response)),
        catchError(error => {
          console.error('Error loading pending perfumes:', error);
          return of([]);
        })
      );
  }

  getAllPerfumes(page = 0, size = 20): Observable<any> {
    return this.http.get(`${this.apiBase}/perfumes/admin`, {
      params: new HttpParams().set('page', String(page)).set('size', String(size))
    })
      .pipe(
        tap(response => console.log('All perfumes received:', response)),
        catchError(error => {
          console.error('Error loading all perfumes:', error);
          return of([]);
        })
      );
  }

  approvePerfume(id: number | string): Observable<any> {
    return this.http.post(`${this.apiBase}/perfumes/admin/${id}/aprobar`, {})
      .pipe(
        tap(response => console.log('Perfume approved:', response)),
        catchError(error => {
          console.error('Error approving perfume:', error);
          throw error;
        })
      );
  }

  rejectPerfume(id: number | string, motivo: string): Observable<any> {
    return this.http.post(`${this.apiBase}/perfumes/admin/${id}/rechazar`, { motivo })
      .pipe(
        tap(response => console.log('Perfume rejected:', response)),
        catchError(error => {
          console.error('Error rejecting perfume:', error);
          throw error;
        })
      );
  }

  deletePerfume(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiBase}/perfumes/admin/${id}`)
      .pipe(
        tap(response => console.log('Perfume deleted:', response)),
        catchError(error => {
          console.error('Error deleting perfume:', error);
          throw error;
        })
      );
  }

  getAllPerfumesAdmin(page = 0, size = 50): Observable<any> {
    return this.getAllPerfumes(page, size);
  }

  // ========== ORDERS ==========

  getOrders(page = 0, size = 20, status?: string): Observable<any> {
    let params = new HttpParams().set('page', String(page)).set('size', String(size));
    if (status) params = params.set('status', status);
    return this.http.get(`${this.apiBase}/admin/orders`, { params })
      .pipe(
        tap(response => console.log('Orders received:', response)),
        catchError(error => {
          console.error('Error loading orders:', error);
          return of([]);
        })
      );
  }

  getOrderDetails(orderId: number | string): Observable<any> {
    return this.http.get(`${this.apiBase}/admin/orders/${orderId}`)
      .pipe(
        tap(response => console.log('Order details received:', response)),
        catchError(error => {
          console.error('Error loading order details:', error);
          return of({});
        })
      );
  }

  cancelOrder(orderId: number | string): Observable<any> {
    return this.http.post(`${this.apiBase}/admin/orders/${orderId}/cancel`, {})
      .pipe(
        tap(response => console.log('Order canceled:', response)),
        catchError(error => {
          console.error('Error canceling order:', error);
          throw error;
        })
      );
  }

  updateOrderStatus(orderId: number | string, newStatus: string): Observable<any> {
    return this.http.patch(`${this.apiBase}/admin/orders/${orderId}/status`, { status: newStatus })
      .pipe(
        tap(response => console.log('Order status updated:', response)),
        catchError(error => {
          console.error('Error updating order status:', error);
          throw error;
        })
      );
  }

  getOrdersByStatus(status: string, page = 0, size = 20): Observable<any> {
    return this.getOrders(page, size, status);
  }

  getModerationStats(): Observable<any> {
    return this.http.get(`${this.apiBase}/admin/moderation/stats`)
      .pipe(
        tap(response => console.log('Moderation stats received:', response)),
        catchError(error => {
          console.error('Error loading moderation stats:', error);
          return of({});
        })
      );
  }

  // ========== BRANDS ==========

  getBrands(page = 0, size = 20): Observable<any> {
    return this.http.get(`${this.apiBase}/brands/admin`, {
      params: new HttpParams().set('page', String(page)).set('size', String(size))
    })
      .pipe(
        tap(response => console.log('Brands received:', response)),
        catchError(error => {
          console.error('Error loading brands:', error);
          return of([]);
        })
      );
  }

  createBrand(payload: any): Observable<any> {
    return this.http.post(`${this.apiBase}/brands`, payload)
      .pipe(
        tap(response => console.log('Brand created:', response)),
        catchError(error => {
          console.error('Error creating brand:', error);
          throw error;
        })
      );
  }

  updateBrand(id: number | string, payload: any): Observable<any> {
    return this.http.put(`${this.apiBase}/brands/${id}`, payload)
      .pipe(
        tap(response => console.log('Brand updated:', response)),
        catchError(error => {
          console.error('Error updating brand:', error);
          throw error;
        })
      );
  }

  deleteBrand(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiBase}/brands/${id}`)
      .pipe(
        tap(response => console.log('Brand deleted:', response)),
        catchError(error => {
          console.error('Error deleting brand:', error);
          throw error;
        })
      );
  }

  // ========== CATEGORIES ==========

  getCategories(page = 0, size = 20): Observable<any> {
    return this.http.get(`${this.apiBase}/categories/admin`, {
      params: new HttpParams().set('page', String(page)).set('size', String(size))
    })
      .pipe(
        tap(response => console.log('Categories received:', response)),
        catchError(error => {
          console.error('Error loading categories:', error);
          return of([]);
        })
      );
  }

  createCategory(payload: any): Observable<any> {
    return this.http.post(`${this.apiBase}/categories`, payload)
      .pipe(
        tap(response => console.log('Category created:', response)),
        catchError(error => {
          console.error('Error creating category:', error);
          throw error;
        })
      );
  }

  updateCategory(id: number | string, payload: any): Observable<any> {
    return this.http.put(`${this.apiBase}/categories/${id}`, payload)
      .pipe(
        tap(response => console.log('Category updated:', response)),
        catchError(error => {
          console.error('Error updating category:', error);
          throw error;
        })
      );
  }

  deleteCategory(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiBase}/categories/${id}`)
      .pipe(
        tap(response => console.log('Category deleted:', response)),
        catchError(error => {
          console.error('Error deleting category:', error);
          throw error;
        })
      );
  }

  // ========== REPORTS / STATS ==========

  getSalesReport(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.apiBase}/admin/reports/sales`, {
      params: new HttpParams().set('startDate', startDate).set('endDate', endDate)
    })
      .pipe(
        tap(response => console.log('Sales report received:', response)),
        catchError(error => {
          console.error('Error loading sales report:', error);
          return of({});
        })
      );
  }

  getTopSellers(): Observable<any> {
    return this.http.get(`${this.apiBase}/admin/reports/top-sellers`)
      .pipe(
        tap(response => console.log('Top sellers received:', response)),
        catchError(error => {
          console.error('Error loading top sellers:', error);
          return of([]);
        })
      );
  }

  getTopProducts(): Observable<any> {
    return this.http.get(`${this.apiBase}/admin/reports/top-products`)
      .pipe(
        tap(response => console.log('Top products received:', response)),
        catchError(error => {
          console.error('Error loading top products:', error);
          return of([]);
        })
      );
  }

  getActiveUsers(): Observable<any> {
    return this.http.get(`${this.apiBase}/admin/reports/active-users`)
      .pipe(
        tap(response => console.log('Active users received:', response)),
        catchError(error => {
          console.error('Error loading active users:', error);
          return of([]);
        })
      );
  }

  // ========== SYSTEM ==========

  getSystemLogs(page = 0, size = 100): Observable<any> {
    return this.http.get(`${this.apiBase}/admin/system/logs`, {
      params: new HttpParams().set('page', String(page)).set('size', String(size))
    })
      .pipe(
        tap(response => console.log('System logs received:', response)),
        catchError(error => {
          console.error('Error loading system logs:', error);
          return of([]);
        })
      );
  }

  getSystemStats(): Observable<any> {
    return this.http.get(`${this.apiBase}/admin/system/stats`)
      .pipe(
        tap(response => console.log('System stats received:', response)),
        catchError(error => {
          console.error('Error loading system stats:', error);
          return of({});
        })
      );
  }

  backupData(): Observable<any> {
    return this.http.post(`${this.apiBase}/admin/system/backup`, {})
      .pipe(
        tap(response => console.log('Backup created:', response)),
        catchError(error => {
          console.error('Error creating backup:', error);
          throw error;
        })
      );
  }

  createSystemBackup(): Observable<any> {
    return this.backupData();
  }
}