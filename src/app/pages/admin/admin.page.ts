import { Component, OnInit } from '@angular/core';
import { AdminService, DashboardStats, User, Store, Order, Brand, Category, Perfume } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false
})
export class AdminPage implements OnInit {

  selectedTab: 'dashboard' | 'users' | 'stores' | 'brands' | 'categories' | 'perfumes' | 'orders' = 'dashboard';

  // Dashboard
  dashboardStats: DashboardStats | null = null;

  // Users
  users: User[] = [];
  filteredUsers: User[] = [];
  userSearchTerm = '';
  userFilterStatus = 'all';
  userPage = 1;

  // Stores
  stores: Store[] = [];
  filteredStores: Store[] = [];
  storeSearchTerm = '';
  storeFilterStatus = 'all';
  storePage = 1;

  // Brands
  brands: Brand[] = [];
  filteredBrands: Brand[] = [];
  brandSearchTerm = '';
  brandPage = 1;
  newBrandName = '';
  newBrandDescription = '';

  // Categories
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  categorySearchTerm = '';
  categoryPage = 1;
  newCategoryName = '';
  newCategoryDescription = '';

  // Perfumes
  perfumes: Perfume[] = [];
  filteredPerfumes: Perfume[] = [];
  perfumeSearchTerm = '';
  perfumePage = 1;

  // Orders
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  orderFilterStatus = 'all';
  orderPage = 1;

  // General
  itemsPerPage = 10;
  isLoading = false;
  selectedUser: User | null = null;
  selectedStore: Store | null = null;
  selectedOrder: Order | null = null;
  selectedBrand: Brand | null = null;
  selectedCategory: Category | null = null;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.loadDashboard();
  }

  selectTab(tab: typeof this.selectedTab) {
    this.selectedTab = tab;
    
    // Load data cuando se selecciona tab
    if (tab === 'users' && this.users.length === 0) {
      this.loadUsers();
    } else if (tab === 'stores' && this.stores.length === 0) {
      this.loadStores();
    } else if (tab === 'brands' && this.brands.length === 0) {
      this.loadBrands();
    } else if (tab === 'categories' && this.categories.length === 0) {
      this.loadCategories();
    } else if (tab === 'perfumes' && this.perfumes.length === 0) {
      this.loadPerfumes();
    } else if (tab === 'orders' && this.orders.length === 0) {
      this.loadOrders();
    }
  }

  // ============= DASHBOARD =============
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

  // ============= USUARIOS =============
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
  }

  applyUserFilters() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = user.nombre.toLowerCase().includes(this.userSearchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(this.userSearchTerm.toLowerCase());
      const matchesStatus = this.userFilterStatus === 'all' || user.estado === this.userFilterStatus;
      return matchesSearch && matchesStatus;
    });
    this.userPage = 1;
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
    if (confirm('¿Bloquear este usuario?')) {
      this.adminService.banUser(userId).subscribe({
        next: () => this.loadUsers(),
        error: (error) => console.error('Error:', error)
      });
    }
  }

  unbanUser(userId: number) {
    if (confirm('¿Desbloquear este usuario?')) {
      this.adminService.unbanUser(userId).subscribe({
        next: () => this.loadUsers(),
        error: (error) => console.error('Error:', error)
      });
    }
  }

  viewUserDetails(user: User) {
    this.selectedUser = user;
  }

  closeUserDetails() {
    this.selectedUser = null;
  }

  // ============= TIENDAS =============
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
  }

  applyStoreFilters() {
    this.filteredStores = this.stores.filter(store => {
      const matchesSearch = store.nombre.toLowerCase().includes(this.storeSearchTerm.toLowerCase());
      const matchesStatus = this.storeFilterStatus === 'all' || store.estado === this.storeFilterStatus;
      return matchesSearch && matchesStatus;
    });
    this.storePage = 1;
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
    if (confirm('¿Verificar tienda?')) {
      this.adminService.verifyStore(storeId).subscribe({
        next: () => this.loadStores(),
        error: (error) => console.error('Error:', error)
      });
    }
  }

  suspendStore(storeId: number) {
    if (confirm('¿Suspender tienda?')) {
      this.adminService.suspendStore(storeId).subscribe({
        next: () => this.loadStores(),
        error: (error) => console.error('Error:', error)
      });
    }
  }

  viewStoreDetails(store: Store) {
    this.selectedStore = store;
  }

  closeStoreDetails() {
    this.selectedStore = null;
  }

  // ============= MARCAS =============
  loadBrands() {
    this.isLoading = true;
    this.adminService.getBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
        this.applyBrandFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading brands:', error);
        this.isLoading = false;
      }
    });
  }

  applyBrandFilters() {
    this.filteredBrands = this.brands.filter(brand =>
      brand.nombre.toLowerCase().includes(this.brandSearchTerm.toLowerCase())
    );
    this.brandPage = 1;
  }

  searchBrands(term: string) {
    this.brandSearchTerm = term;
    this.applyBrandFilters();
  }

  createBrand() {
    if (!this.newBrandName.trim()) return;
    const brand = {
      nombre: this.newBrandName,
      descripcion: this.newBrandDescription,
      activo: true
    };
    this.adminService.createBrand(brand).subscribe({
      next: () => {
        this.newBrandName = '';
        this.newBrandDescription = '';
        this.loadBrands();
      },
      error: (error) => console.error('Error:', error)
    });
  }

  deleteBrand(id: number) {
    if (confirm('¿Eliminar marca?')) {
      this.adminService.deleteBrand(id).subscribe({
        next: () => this.loadBrands(),
        error: (error) => console.error('Error:', error)
      });
    }
  }

  // ============= CATEGORÍAS =============
  loadCategories() {
    this.isLoading = true;
    this.adminService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.applyCategoryFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoading = false;
      }
    });
  }

  applyCategoryFilters() {
    this.filteredCategories = this.categories.filter(category =>
      category.nombre.toLowerCase().includes(this.categorySearchTerm.toLowerCase())
    );
    this.categoryPage = 1;
  }

  searchCategories(term: string) {
    this.categorySearchTerm = term;
    this.applyCategoryFilters();
  }

  createCategory() {
    if (!this.newCategoryName.trim()) return;
    const category = {
      nombre: this.newCategoryName,
      descripcion: this.newCategoryDescription,
      activo: true
    };
    this.adminService.createCategory(category).subscribe({
      next: () => {
        this.newCategoryName = '';
        this.newCategoryDescription = '';
        this.loadCategories();
      },
      error: (error) => console.error('Error:', error)
    });
  }

  deleteCategory(id: number) {
    if (confirm('¿Eliminar categoría?')) {
      this.adminService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (error) => console.error('Error:', error)
      });
    }
  }

  // ============= PERFUMES =============
  loadPerfumes() {
    this.isLoading = true;
    this.adminService.getPerfumes(0, 50).subscribe({
      next: (data) => {
        this.perfumes = data.content || data;
        this.applyPerfumeFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading perfumes:', error);
        this.isLoading = false;
      }
    });
  }

  applyPerfumeFilters() {
    this.filteredPerfumes = this.perfumes.filter(perfume =>
      perfume.nombre.toLowerCase().includes(this.perfumeSearchTerm.toLowerCase())
    );
    this.perfumePage = 1;
  }

  searchPerfumes(term: string) {
    this.perfumeSearchTerm = term;
    this.applyPerfumeFilters();
  }

  deletePerfume(id: number) {
    if (confirm('¿Eliminar perfume?')) {
      this.adminService.deletePerfume(id).subscribe({
        next: () => this.loadPerfumes(),
        error: (error) => console.error('Error:', error)
      });
    }
  }

  // ============= PEDIDOS =============
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
  }

  applyOrderFilters() {
    this.filteredOrders = this.orders.filter(order =>
      this.orderFilterStatus === 'all' || order.estado === this.orderFilterStatus
    );
    this.orderPage = 1;
  }

  filterOrdersByStatus(status: string) {
    this.orderFilterStatus = status;
    this.applyOrderFilters();
  }

  updateOrderStatus(orderId: number, newStatus: string) {
    this.adminService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => this.loadOrders(),
      error: (error) => console.error('Error:', error)
    });
  }

  viewOrderDetails(order: Order) {
    this.selectedOrder = order;
  }

  closeOrderDetails() {
    this.selectedOrder = null;
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

  get paginatedBrands(): Brand[] {
    const start = (this.brandPage - 1) * this.itemsPerPage;
    return this.filteredBrands.slice(start, start + this.itemsPerPage);
  }

  get paginatedCategories(): Category[] {
    const start = (this.categoryPage - 1) * this.itemsPerPage;
    return this.filteredCategories.slice(start, start + this.itemsPerPage);
  }

  get paginatedPerfumes(): Perfume[] {
    const start = (this.perfumePage - 1) * this.itemsPerPage;
    return this.filteredPerfumes.slice(start, start + this.itemsPerPage);
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

  get totalBrandPages(): number {
    return Math.ceil(this.filteredBrands.length / this.itemsPerPage);
  }

  get totalCategoryPages(): number {
    return Math.ceil(this.filteredCategories.length / this.itemsPerPage);
  }

  get totalPerfumePages(): number {
    return Math.ceil(this.filteredPerfumes.length / this.itemsPerPage);
  }

  get totalOrderPages(): number {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }
}
