import { Component, OnInit } from '@angular/core';
import { AdminService, DashboardStats, User, Store, Order } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false
})
export class AdminPage implements OnInit {

<<<<<<< HEAD
  // Tab control
  selectedTab: 'dashboard' | 'users' | 'stores' | 'orders' | 'products' | 'reports' = 'dashboard';

  // Dashboard data
  dashboardStats: DashboardStats | null = null;

  // Users management
=======
  selectedTab: 'dashboard' | 'users' | 'stores' | 'orders' | 'products' | 'reports' = 'dashboard';

  dashboardStats: DashboardStats | null = null;

>>>>>>> seller
  users: User[] = [];
  filteredUsers: User[] = [];
  userSearchTerm = '';
  userFilterStatus = 'all';

<<<<<<< HEAD
  // Stores management
=======
>>>>>>> seller
  stores: Store[] = [];
  filteredStores: Store[] = [];
  storeSearchTerm = '';
  storeFilterStatus = 'all';

<<<<<<< HEAD
  // Orders management
=======
>>>>>>> seller
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  orderFilterStatus = 'all';

<<<<<<< HEAD
  // Pagination
=======
>>>>>>> seller
  userPage = 1;
  storePage = 1;
  orderPage = 1;
  itemsPerPage = 10;

<<<<<<< HEAD
  // Loading states
=======
>>>>>>> seller
  isLoading = false;
  selectedUser: User | null = null;
  selectedStore: Store | null = null;
  selectedOrder: Order | null = null;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.loadDashboard();
  }

<<<<<<< HEAD

  loadDashboard() {
    this.isLoading = true;
    this.dashboardStats = this.adminService.getDashboardStats();
    this.isLoading = false;
  }

 
  loadUsers() {
    this.isLoading = true;
    this.users = this.adminService.getUsers();
    this.applyUserFilters();
    this.isLoading = false;
=======
  loadDashboard() {
    this.isLoading = true;
    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        this.isLoading = false;
      }
    });
  }

  loadUsers() {
    this.isLoading = true;
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyUserFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });
>>>>>>> seller
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
<<<<<<< HEAD
      this.adminService.banUser(userId);
      this.loadUsers();
=======
      this.adminService.banUser(userId).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error banning user:', error);
          alert('Error al bloquear usuario');
        }
      });
>>>>>>> seller
    }
  }

  unbanUser(userId: number) {
    if (confirm('¿Estás seguro de que quieres desbloquear este usuario?')) {
<<<<<<< HEAD
      this.adminService.unbanUser(userId);
      this.loadUsers();
=======
      this.adminService.unbanUser(userId).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error unbanning user:', error);
          alert('Error al desbloquear usuario');
        }
      });
>>>>>>> seller
    }
  }

  viewUserDetails(user: User) {
    this.selectedUser = user;
  }

  closeUserDetails() {
    this.selectedUser = null;
  }

<<<<<<< HEAD
  // ============= STORES MANAGEMENT =============
  loadStores() {
    this.isLoading = true;
    this.stores = this.adminService.getStores();
    this.applyStoreFilters();
    this.isLoading = false;
=======
  loadStores() {
    this.isLoading = true;
    this.adminService.getStores().subscribe({
      next: (stores) => {
        this.stores = stores;
        this.applyStoreFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading stores:', error);
        this.isLoading = false;
      }
    });
>>>>>>> seller
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
<<<<<<< HEAD
      this.adminService.verifyStore(storeId);
      this.loadStores();
=======
      this.adminService.verifyStore(storeId).subscribe({
        next: () => {
          this.loadStores();
        },
        error: (error) => {
          console.error('Error verifying store:', error);
          alert('Error al verificar tienda');
        }
      });
>>>>>>> seller
    }
  }

  suspendStore(storeId: number) {
    if (confirm('¿Suspender esta tienda?')) {
<<<<<<< HEAD
      this.adminService.suspendStore(storeId);
      this.loadStores();
=======
      this.adminService.suspendStore(storeId).subscribe({
        next: () => {
          this.loadStores();
        },
        error: (error) => {
          console.error('Error suspending store:', error);
          alert('Error al suspender tienda');
        }
      });
>>>>>>> seller
    }
  }

  viewStoreDetails(store: Store) {
    this.selectedStore = store;
  }

  closeStoreDetails() {
    this.selectedStore = null;
  }

<<<<<<< HEAD
  // ============= ORDERS MANAGEMENT =============
  loadOrders() {
    this.isLoading = true;
    this.orders = this.adminService.getOrders();
    this.applyOrderFilters();
    this.isLoading = false;
=======
  loadOrders() {
    this.isLoading = true;
    this.adminService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.applyOrderFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading = false;
      }
    });
>>>>>>> seller
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
<<<<<<< HEAD
    this.adminService.updateOrderStatus(orderId, newStatus);
    this.loadOrders();
=======
    this.adminService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        alert('Error al actualizar estado del pedido');
      }
    });
>>>>>>> seller
  }

  viewOrderDetails(order: Order) {
    this.selectedOrder = order;
  }

  closeOrderDetails() {
    this.selectedOrder = null;
  }

<<<<<<< HEAD
  // ============= PRODUCTS MANAGEMENT =============
  deleteProduct(productId: number) {
    if (confirm('¿Eliminar este producto?')) {
      this.adminService.deleteProduct(productId);
      alert('Producto eliminado');
    }
  }

  // ============= TAB NAVIGATION =============
=======
  deleteProduct(productId: number) {
    if (confirm('¿Eliminar este producto?')) {
      this.adminService.deleteProduct(productId).subscribe({
        next: () => {
          alert('Producto eliminado');
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Error al eliminar producto');
        }
      });
    }
  }

>>>>>>> seller
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
<<<<<<< HEAD

}
=======
}
>>>>>>> seller
