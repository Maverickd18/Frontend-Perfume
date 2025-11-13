import { Component, OnInit } from '@angular/core';
import { AdminService, DashboardStats, User, Store, Order, Brand, Category, Perfume } from '../../services/admin.service';
import { StepperService } from '../../services/stepper.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false
})
export class AdminPage implements OnInit {

  selectedTab: 'dashboard' | 'users' | 'brands' | 'perfumes' | 'orders' = 'dashboard';

  // Dashboard
  dashboardStats: DashboardStats | null = null;
  topBrands: any[] = [];
  topSellers: any[] = [];
  topCustomers: any[] = [];

  // Users
  users: User[] = [];
  filteredUsers: User[] = [];
  userSearchTerm = '';
  userFilterStatus = 'all';
  userPage = 1;

  // Brands
  brands: Brand[] = [];
  filteredBrands: Brand[] = [];
  brandSearchTerm = '';
  brandPage = 1;

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

  constructor(private adminService: AdminService, private stepperService: StepperService) { }

  ngOnInit() {
    this.loadDashboard();
  }

  selectTab(tab: typeof this.selectedTab) {
    this.selectedTab = tab;
    
    // Load data cuando se selecciona tab
    if (tab === 'users' && this.users.length === 0) {
      this.loadUsers();
    } else if (tab === 'brands' && this.brands.length === 0) {
      this.loadBrands();
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
        // Cargar datos adicionales
        this.loadTopBrands();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        this.isLoading = false;
      }
    });
  }

  loadTopBrands() {
    this.adminService.getBrands().subscribe({
      next: (brands) => {
        // Simular datos de top brands (en el backend se podría hacer directamente)
        this.topBrands = brands.slice(0, 5).map((brand: any) => ({
          ...brand,
          productCount: Math.floor(Math.random() * 50) + 5,
          sales: Math.floor(Math.random() * 1000) + 100
        }));
        this.loadTopSellers();
        this.loadTopCustomers();
      },
      error: (error) => {
        console.error('Error loading top brands:', error);
      }
    });
  }

  loadTopSellers() {
    this.adminService.getUsers().subscribe({
      next: (users) => {
        // Filtrar solo vendedores y simular datos de ingresos
        this.topSellers = users.filter((u: any) => u.rol === 'VENDEDOR').map((seller: any) => ({
          ...seller,
          nombre: seller.name || seller.nombre,
          email: seller.email,
          estado: seller.active ? 'activo' : 'inactivo',
          productCount: Math.floor(Math.random() * 50) + 1,
          totalRevenue: Math.floor(Math.random() * 50000) + 1000,
          orderCount: Math.floor(Math.random() * 200) + 10,
          rating: (Math.random() * 5).toFixed(1)
        })).slice(0, 8);
      },
      error: (error) => {
        console.error('Error loading top sellers:', error);
      }
    });
  }

  loadTopCustomers() {
    this.adminService.getUsers().subscribe({
      next: (users) => {
        // Filtrar solo clientes y simular datos de gasto
        this.topCustomers = users.filter((u: any) => u.rol === 'CLIENTE').map((customer: any) => ({
          ...customer,
          nombre: customer.name || customer.nombre,
          email: customer.email,
          estado: customer.active ? 'activo' : 'inactivo',
          purchaseCount: Math.floor(Math.random() * 100) + 1,
          totalSpent: Math.floor(Math.random() * 10000) + 100,
          avgOrderValue: (Math.random() * 500 + 50).toFixed(2),
          monthlyPurchases: Math.floor(Math.random() * 15) + 1
        })).slice(0, 8);
      },
      error: (error) => {
        console.error('Error loading top customers:', error);
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
      brand.name.toLowerCase().includes(this.brandSearchTerm.toLowerCase())
    );
    this.brandPage = 1;
  }

  searchBrands(term: string) {
    this.brandSearchTerm = term;
    this.applyBrandFilters();
  }

  deleteBrand(id: number) {
    if (confirm('¿Eliminar marca?')) {
      this.adminService.deleteBrand(id).subscribe({
        next: () => this.loadBrands(),
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
      perfume.name.toLowerCase().includes(this.perfumeSearchTerm.toLowerCase())
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

  get paginatedBrands(): Brand[] {
    const start = (this.brandPage - 1) * this.itemsPerPage;
    return this.filteredBrands.slice(start, start + this.itemsPerPage);
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

  get totalBrandPages(): number {
    return Math.ceil(this.filteredBrands.length / this.itemsPerPage);
  }

  get totalPerfumePages(): number {
    return Math.ceil(this.filteredPerfumes.length / this.itemsPerPage);
  }

  get totalOrderPages(): number {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }

  // ============= CREATE STEPPER =============
  openCreateBrandStepper() {
    // Abre el stepper para crear marca (usa el mismo componente)
    this.stepperService.openStepper();
  }

  openCreatePerfumeStepper() {
    // Abre el stepper para crear perfume
    this.stepperService.openStepper();
  }
}
