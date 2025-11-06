import { Component, OnInit } from '@angular/core';
import { AdminService, DashboardStats, User, Store, Order } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false
})
export class AdminPage implements OnInit {

  // Tab control
  selectedTab: 'dashboard' | 'users' | 'stores' | 'orders' | 'products' | 'reports' = 'dashboard';

  // Dashboard data
  dashboardStats: DashboardStats | null = null;

  // Users management
  users: User[] = [];
  filteredUsers: User[] = [];
  userSearchTerm = '';
  userFilterStatus = 'all';

  // Stores management
  stores: Store[] = [];
  filteredStores: Store[] = [];
  storeSearchTerm = '';
  storeFilterStatus = 'all';

  // Orders management
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  orderFilterStatus = 'all';

  // Pagination
  userPage = 1;
  storePage = 1;
  orderPage = 1;
  itemsPerPage = 10;

  // Loading states
  isLoading = false;
  selectedUser: User | null = null;
  selectedStore: Store | null = null;
  selectedOrder: Order | null = null;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.loadDashboard();
  }

  // ============= DASHBOARD =============
  loadDashboard() {
    this.isLoading = true;
    this.dashboardStats = this.adminService.getDashboardStats();
    this.isLoading = false;
  }

  // ============= USERS MANAGEMENT =============
  loadUsers() {
    this.isLoading = true;
    this.users = this.adminService.getUsers();
    this.applyUserFilters();
    this.isLoading = false;
  }

  applyUserFilters() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = user.nombre.toLowerCase().includes(this.userSearchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(this.userSearchTerm.toLowerCase());
      const matchesStatus = this.userFilterStatus === 'all' || user.estado === this.userFilterStatus;
      return matchesSearch && matchesStatus;
    });
  }

  searchUsers(term: string) {
    this.userSearchTerm = term;
    this.applyUserFilters();
  }

  filterUsersByStatus(status: string) {
    this.userFilterStatus = status;
    this.applyUserFilters();
  }

  banUser(userId: number) {
    if (confirm('¿Estás seguro de que quieres bloquear este usuario?')) {
      this.adminService.banUser(userId);
      this.loadUsers();
    }
  }

  unbanUser(userId: number) {
    if (confirm('¿Estás seguro de que quieres desbloquear este usuario?')) {
      this.adminService.unbanUser(userId);
      this.loadUsers();
    }
  }

  viewUserDetails(user: User) {
    this.selectedUser = user;
  }

  closeUserDetails() {
    this.selectedUser = null;
  }

  // ============= STORES MANAGEMENT =============
  loadStores() {
    this.isLoading = true;
    this.stores = this.adminService.getStores();
    this.applyStoreFilters();
    this.isLoading = false;
  }

  applyStoreFilters() {
    this.filteredStores = this.stores.filter(store => {
      const matchesSearch = store.nombre.toLowerCase().includes(this.storeSearchTerm.toLowerCase());
      const matchesStatus = this.storeFilterStatus === 'all' || store.estado === this.storeFilterStatus;
      return matchesSearch && matchesStatus;
    });
  }

  searchStores(term: string) {
    this.storeSearchTerm = term;
    this.applyStoreFilters();
  }

  filterStoresByStatus(status: string) {
    this.storeFilterStatus = status;
    this.applyStoreFilters();
  }

  verifyStore(storeId: number) {
    if (confirm('¿Verificar esta tienda?')) {
      this.adminService.verifyStore(storeId);
      this.loadStores();
    }
  }

  suspendStore(storeId: number) {
    if (confirm('¿Suspender esta tienda?')) {
      this.adminService.suspendStore(storeId);
      this.loadStores();
    }
  }

  viewStoreDetails(store: Store) {
    this.selectedStore = store;
  }

  closeStoreDetails() {
    this.selectedStore = null;
  }

  // ============= ORDERS MANAGEMENT =============
  loadOrders() {
    this.isLoading = true;
    this.orders = this.adminService.getOrders();
    this.applyOrderFilters();
    this.isLoading = false;
  }

  applyOrderFilters() {
    this.filteredOrders = this.orders.filter(order => {
      const matchesStatus = this.orderFilterStatus === 'all' || order.estado === this.orderFilterStatus;
      return matchesStatus;
    });
  }

  filterOrdersByStatus(status: string) {
    this.orderFilterStatus = status;
    this.applyOrderFilters();
  }

  updateOrderStatus(orderId: number, newStatus: string) {
    this.adminService.updateOrderStatus(orderId, newStatus);
    this.loadOrders();
  }

  viewOrderDetails(order: Order) {
    this.selectedOrder = order;
  }

  closeOrderDetails() {
    this.selectedOrder = null;
  }

  // ============= PRODUCTS MANAGEMENT =============
  deleteProduct(productId: number) {
    if (confirm('¿Eliminar este producto?')) {
      this.adminService.deleteProduct(productId);
      alert('Producto eliminado');
    }
  }

  // ============= TAB NAVIGATION =============
  selectTab(tab: 'dashboard' | 'users' | 'stores' | 'orders' | 'products' | 'reports') {
    this.selectedTab = tab;
    
    // Load data when switching tabs
    if (tab === 'users' && this.users.length === 0) {
      this.loadUsers();
    } else if (tab === 'stores' && this.stores.length === 0) {
      this.loadStores();
    } else if (tab === 'orders' && this.orders.length === 0) {
      this.loadOrders();
    }
  }

  // ============= PAGINATION =============
  get paginatedUsers(): User[] {
    const start = (this.userPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(start, start + this.itemsPerPage);
  }

  get paginatedStores(): Store[] {
    const start = (this.storePage - 1) * this.itemsPerPage;
    return this.filteredStores.slice(start, start + this.itemsPerPage);
  }

  get paginatedOrders(): Order[] {
    const start = (this.orderPage - 1) * this.itemsPerPage;
    return this.filteredOrders.slice(start, start + this.itemsPerPage);
  }

  get totalUserPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  get totalStorePages(): number {
    return Math.ceil(this.filteredStores.length / this.itemsPerPage);
  }

  get totalOrderPages(): number {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }

}
