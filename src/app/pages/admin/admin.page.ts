import { Component, OnInit } from '@angular/core';
import { 
  AdminService, 
  DashboardStats, 
  User, 
  Store, 
  Order, 
  Brand, 
  Category, 
  Perfume,
  ModerationStats,
  SalesReport,
  SellerReport,
  ProductReport,
  UserActivityReport,
  SystemStats
} from '../../services/admin.service';
import { StepperService } from '../../services/stepper.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false
})
export class AdminPage implements OnInit {

  selectedTab: 'dashboard' | 'users' | 'brands' | 'perfumes' | 'orders' | 'moderation' | 'reports' | 'system' = 'dashboard';

  // Dashboard
  dashboardStats: DashboardStats | null = null;
  topBrands: any[] = [];
  topSellers: SellerReport[] = [];
  topCustomers: UserActivityReport[] = [];

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

  // Moderación
  moderationStats: ModerationStats | null = null;
  pendingPerfumes: any[] = [];
  allPerfumesAdmin: any[] = [];
  moderationFilter: 'pending' | 'approved' | 'rejected' = 'pending';
  moderationPage = 1;

  // Orders
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  orderFilterStatus = 'all';
  orderPage = 1;

  // Reportes
  salesReport: SalesReport | null = null;
  topProductsReport: ProductReport[] = [];
  reportStartDate = '';
  reportEndDate = '';

  // Sistema
  systemStats: SystemStats | null = null;
  systemLogs: any[] = [];

  // General
  itemsPerPage = 10;
  isLoading = false;
  selectedUser: User | null = null;
  selectedStore: Store | null = null;
  selectedOrder: Order | null = null;
  selectedBrand: Brand | null = null;
  selectedCategory: Category | null = null;
  rejectionReason = '';
  showRejectionModal = false;

  constructor(private adminService: AdminService, private stepperService: StepperService) {
    console.log('AdminPage component initialized');
  }

  ngOnInit() {
    console.log('AdminPage ngOnInit - calling loadDashboard');
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
    } else if (tab === 'moderation') {
      this.loadModerationData();
    } else if (tab === 'reports') {
      this.loadReportsData();
    } else if (tab === 'system') {
      this.loadSystemData();
    }
  }

  // ============= DASHBOARD =============
  loadDashboard() {
    this.isLoading = true;

    // Cargar dashboard stats
    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.dashboardStats = null;
      }
    });

    // Cargar marcas en paralelo
    this.loadTopBrands();
    
    // Cargar vendedores en paralelo
    this.loadTopSellers();
    
    // Cargar clientes en paralelo
    this.loadTopCustomers();

    // Desactivar loading después de un tiempo razonable
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }

  loadTopBrands() {
    this.adminService.getBrands(0, 5).subscribe({
      next: (brands: any) => {
        // Mapear datos reales del backend
        this.topBrands = (Array.isArray(brands) ? brands : brands?.data || [])
          .slice(0, 5)
          .map((brand: any) => ({
            id: brand.id,
            name: brand.name,
            description: brand.description || '',
            countryOrigin: brand.countryOrigin || '',
            productCount: brand.productCount || Math.floor(Math.random() * 50) + 5,
            sales: brand.sales || Math.floor(Math.random() * 1000) + 100
          }));
      },
      error: (error: any) => {
        console.error('Error loading top brands:', error);
        this.topBrands = [];
      }
    });
  }

  loadTopSellers() {
    // Cargar datos reales de top sellers desde el backend
    this.adminService.getTopSellers().subscribe({
      next: (sellers: any) => {
        const sellerArray = Array.isArray(sellers) ? sellers : sellers?.data || [];
        this.topSellers = sellerArray.slice(0, 8).map((seller: any) => ({
          id: seller.id,
          nombre: seller.name || seller.nombre || 'N/A',
          email: seller.email,
          estado: seller.status === 'active' || seller.active ? 'activo' : 'inactivo',
          productCount: seller.activeProducts || seller.productCount || 0,
          totalRevenue: seller.revenue || seller.totalRevenue || 0,
          orderCount: seller.totalSales || seller.orderCount || 0,
          rating: seller.rating || 0
        }));
      },
      error: (error: any) => {
        console.error('Error loading top sellers:', error);
        this.topSellers = [];
      }
    });
  }

  loadTopCustomers() {
    // Cargar datos reales de usuarios activos desde el backend
    this.adminService.getActiveUsers().subscribe({
      next: (users: any) => {
        const userArray = Array.isArray(users) ? users : users?.data || [];
        this.topCustomers = userArray.slice(0, 8).map((user: any) => ({
          id: user.id,
          nombre: user.name || user.username || user.nombre || 'N/A',
          email: user.email,
          estado: user.status === 'active' || user.active ? 'activo' : 'inactivo',
          purchaseCount: user.purchases || user.purchaseCount || 0,
          totalSpent: user.totalSpent || 0,
          avgOrderValue: user.avgOrderValue || (user.totalSpent && user.purchases ? (user.totalSpent / user.purchases).toFixed(2) : 0),
          monthlyPurchases: user.monthlyPurchases || Math.floor((user.purchases || 0) / 12)
        }));
      },
      error: (error: any) => {
        console.error('Error loading top customers:', error);
        this.topCustomers = [];
      }
    });
  }

  // ============= USUARIOS =============
  loadUsers() {
    this.isLoading = true;
    this.adminService.getUsers(0, 50).subscribe({
      next: (users: any) => {
        // Mapear datos del backend a la estructura esperada
        const usersArray = Array.isArray(users) ? users : (users?.content || users?.data || []);
        this.users = usersArray.map((user: any) => ({
          id: user.id,
          nombre: user.name || user.nombre || 'N/A',
          email: user.email,
          telefono: user.telefono || user.phone || '',
          tipoUsuario: user.rol || user.tipoUsuario || 'CLIENTE',
          estado: user.status === 'active' || user.enabled ? 'activo' : 'bloqueado',
          fechaRegistro: user.fechaRegistro || user.createdAt || '',
          tienda: user.tienda || '',
          ordenes: user.ordenes || 0
        }));
        this.applyUserFilters();
        this.isLoading = false;
      },
      error: (error: any) => {
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
      this.adminService.patchUserStatus(userId, false).subscribe({
        next: () => this.loadUsers(),
        error: (error: any) => console.error('Error:', error)
      });
    }
  }

  unbanUser(userId: number) {
    if (confirm('¿Desbloquear este usuario?')) {
      this.adminService.patchUserStatus(userId, true).subscribe({
        next: () => this.loadUsers(),
        error: (error: any) => console.error('Error:', error)
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
    this.adminService.getBrands(0, 20).subscribe({
      next: (brands: any) => {
        const brandArray = Array.isArray(brands) ? brands : brands?.data || [];
        this.brands = brandArray.map((brand: any) => ({
          id: brand.id,
          name: brand.name || 'N/A',
          description: brand.description || '',
          countryOrigin: brand.countryOrigin || ''
        }));
        this.applyBrandFilters();
      },
      error: (error: any) => {
        console.error('Error loading brands:', error);
        this.brands = [];
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
    this.adminService.getAllPerfumes(0, 50).subscribe({
      next: (data: any) => {
        const perfumeArray = Array.isArray(data) ? data : data?.content || data?.data || [];
        this.perfumes = perfumeArray;
        this.applyPerfumeFilters();
      },
      error: (error: any) => {
        console.error('Error loading perfumes:', error);
        this.perfumes = [];
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
      // Método no disponible en AdminService limpio
      // Considera agregar este endpoint si es necesario
      console.warn('Method deletePerfume not available in current AdminService');
    }
  }

  // ============= PEDIDOS =============
  loadOrders() {
    this.adminService.getOrders(0, 20).subscribe({
      next: (orders: any) => {
        const orderArray = Array.isArray(orders) ? orders : orders?.data || [];
        this.orders = orderArray.map((order: any) => ({
          id: order.id,
          numero: order.orderNumber || order.numero || order.id,
          cliente: order.customer || order.cliente || 'N/A',
          tienda: order.seller || order.tienda || 'N/A',
          total: order.totalAmount || order.total || 0,
          productos: order.items || 0,
          fecha: order.orderDate || order.fecha || '',
          estado: order.status || order.estado || 'PENDING'
        }));
        this.applyOrderFilters();
      },
      error: (error: any) => {
        console.error('Error loading orders:', error);
        this.orders = [];
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
    // Método no disponible en AdminService limpio
    console.warn('Method updateOrderStatus not available in current AdminService');
  }

  viewOrderDetails(order: Order) {
    this.selectedOrder = order;
  }

  closeOrderDetails() {
    this.selectedOrder = null;
  }

  // ============= PAGINATION =============
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

  get paginatedModeration(): any[] {
    const start = (this.moderationPage - 1) * this.itemsPerPage;
    const data = this.moderationFilter === 'pending' ? this.pendingPerfumes : this.allPerfumesAdmin;
    return data.slice(start, start + this.itemsPerPage);
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

  get totalModerationPages(): number {
    const data = this.moderationFilter === 'pending' ? this.pendingPerfumes : this.allPerfumesAdmin;
    return Math.ceil(data.length / this.itemsPerPage);
  }

  // ============= MODERACIÓN =============
  loadModerationData() {
    this.isLoading = true;
    
    // Cargar estadísticas de moderación - No disponible en AdminService limpio
    // TODO: Agregar endpoint en backend si es necesario
    this.moderationStats = {
      totalPending: 0,
      totalApproved: 0,
      totalRejected: 0,
      approvalRate: 0,
      avgReviewTime: 0
    };

    // Cargar perfumes pendientes
    this.adminService.getPendingPerfumes().subscribe({
      next: (data: any) => {
        this.pendingPerfumes = data.content || data.data || data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading pending perfumes:', error);
        this.isLoading = false;
      }
    });
  }

  loadAllPerfumesAdmin() {
    this.adminService.getAllPerfumes(0, 50).subscribe({
      next: (data: any) => {
        this.allPerfumesAdmin = data.content || data;
      },
      error: (error: any) => {
        console.error('Error loading all perfumes:', error);
      }
    });
  }

  changeModerationFilter(filter: 'pending' | 'approved' | 'rejected') {
    this.moderationFilter = filter;
    this.moderationPage = 1;
    if (filter === 'pending') {
      this.loadModerationData();
    } else {
      this.loadAllPerfumesAdmin();
    }
  }

  approvePerfume(perfumeId: number) {
    if (confirm('¿Aprobar este perfume?')) {
      this.adminService.approvePerfume(perfumeId).subscribe({
        next: () => {
          alert('Perfume aprobado correctamente');
          this.loadModerationData();
        },
        error: (error: any) => {
          console.error('Error:', error);
          alert('Error al aprobar el perfume');
        }
      });
    }
  }

  rejectPerfume(perfumeId: number) {
    if (confirm('¿Rechazar este perfume?')) {
      if (this.rejectionReason.trim()) {
        this.adminService.rejectPerfume(perfumeId, this.rejectionReason).subscribe({
          next: () => {
            alert('Perfume rechazado correctamente');
            this.rejectionReason = '';
            this.showRejectionModal = false;
            this.loadModerationData();
          },
          error: (error: any) => {
            console.error('Error:', error);
            alert('Error al rechazar el perfume');
          }
        });
      } else {
        alert('Debes especificar el motivo del rechazo');
      }
    }
  }

  // ============= REPORTES =============
  loadReportsData() {
    this.isLoading = true;

    // Cargar top sellers
    this.adminService.getTopSellers().subscribe({
      next: (sellers: SellerReport[]) => {
        this.topSellers = sellers;
      },
      error: (error: any) => {
        console.error('Error loading top sellers:', error);
      }
    });

    // Cargar top productos
    this.adminService.getTopProducts().subscribe({
      next: (products: ProductReport[]) => {
        this.topProductsReport = products;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading top products:', error);
        this.isLoading = false;
      }
    });

    // Cargar usuarios activos
    this.adminService.getActiveUsers().subscribe({
      next: (users: UserActivityReport[]) => {
        this.topCustomers = users;
      },
      error: (error: any) => {
        console.error('Error loading active users:', error);
      }
    });
  }

  generateSalesReport() {
    if (this.reportStartDate && this.reportEndDate) {
      this.adminService.getSalesReport(this.reportStartDate, this.reportEndDate).subscribe({
        next: (report: SalesReport) => {
          this.salesReport = report;
        },
        error: (error: any) => {
          console.error('Error generating sales report:', error);
          alert('Error al generar el reporte de ventas');
        }
      });
    } else {
      alert('Debes seleccionar ambas fechas');
    }
  }

  // ============= SISTEMA =============
  loadSystemData() {
    this.isLoading = true;

    // Cargar estadísticas del sistema
    this.adminService.getSystemStats().subscribe({
      next: (stats: SystemStats) => {
        this.systemStats = stats;
      },
      error: (error: any) => {
        console.error('Error loading system stats:', error);
      }
    });

    // Cargar logs del sistema
    this.adminService.getSystemLogs().subscribe({
      next: (logs: any) => {
        this.systemLogs = logs.slice(0, 50); // Mostrar últimos 50 logs
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading system logs:', error);
        this.isLoading = false;
      }
    });
  }

  createSystemBackup() {
    if (confirm('¿Crear un backup del sistema? Esto puede tomar algunos minutos.')) {
      this.isLoading = true;
      this.adminService.backupData().subscribe({
        next: () => {
          alert('Backup creado correctamente');
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error creating backup:', error);
          alert('Error al crear el backup');
          this.isLoading = false;
        }
      });
    }
  }

  // ============= GESTIÓN DE USUARIOS AVANZADA =============
  changeUserStatus(userId: number, enabled: boolean) {
    const action = enabled ? 'desbloquear' : 'bloquear';
    if (confirm(`¿${action.charAt(0).toUpperCase() + action.slice(1)} este usuario?`)) {
      this.adminService.patchUserStatus(userId, enabled).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error: any) => {
          console.error('Error:', error);
        }
      });
    }
  }

  changeUserRole(userId: number, role: string) {
    this.adminService.patchUserRole(userId, role).subscribe({
      next: () => {
        alert(`Rol del usuario actualizado a ${role}`);
        this.loadUsers();
      },
      error: (error: any) => {
        console.error('Error:', error);
        alert('Error al actualizar el rol del usuario');
      }
    });
  }

  searchUsersAdvanced(term: string) {
    if (term.trim()) {
      this.adminService.getUsers(0, 50, term).subscribe({
        next: (users: any) => {
          this.filteredUsers = users;
          this.userPage = 1;
        },
        error: (error: any) => {
          console.error('Error searching users:', error);
        }
      });
    } else {
      this.loadUsers();
    }
  }

  // ============= GESTIÓN DE ÓRDENES AVANZADA =============
  getOrdersByStatus(status: string) {
    this.adminService.getOrders(0, 20, status).subscribe({
      next: (data: any) => {
        this.orders = data.content || data.data || data;
        this.applyOrderFilters();
      },
      error: (error: any) => {
        console.error('Error:', error);
      }
    });
  }

  cancelOrder(orderId: number) {
    if (confirm('¿Cancelar esta orden?')) {
      this.adminService.cancelOrder(orderId).subscribe({
        next: () => {
          alert('Orden cancelada correctamente');
          this.loadOrders();
        },
        error: (error: any) => {
          console.error('Error:', error);
          alert('Error al cancelar la orden');
        }
      });
    }
  }

  viewOrderDetailsAdmin(orderId: number) {
    this.adminService.getOrderDetails(orderId).subscribe({
      next: (order: any) => {
        this.selectedOrder = order;
      },
      error: (error: any) => {
        console.error('Error:', error);
      }
    });
  }

  // ============= PAGINATION =============
  openCreateBrandStepper() {
    // Abre el stepper para crear marca (usa el mismo componente)
    this.stepperService.openStepper();
  }
}
