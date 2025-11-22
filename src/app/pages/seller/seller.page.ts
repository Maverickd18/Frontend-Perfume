import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SellerService, Perfume, Brand, ModerationStatus, ModerationStats } from '../../services/seller.service';
import { StepperService } from '../../services/stepper.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.page.html',
  styleUrls: ['./seller.page.scss'],
  standalone: false
})
export class SellerPage implements OnInit {
  perfumes: Perfume[] = [];
  brands: Brand[] = [];
  selectedPerfumes = new Set<number>();
  showBrandsSection = false;
  isLoading = false;
  isLoadingBrands = false;
  isCreateModalOpen = false;
  unreadNotifications = 0;

  // Filtros de moderación
  moderationFilter: ModerationStatus | 'ALL' = 'ALL';
  brandModerationFilter: ModerationStatus | 'ALL' = 'ALL';

  // Estadísticas
  moderationStats: ModerationStats = { approved: 0, pending: 0, rejected: 0, draft: 0 };
  brandModerationStats: ModerationStats = { approved: 0, pending: 0, rejected: 0, draft: 0 };

  // Nueva marca
  newBrand = {
    name: '',
    description: '',
    countryOrigin: '',
    imageUrl: ''
  };

  ModerationStatus = ModerationStatus;

  constructor(
    private sellerService: SellerService,
    private stepperService: StepperService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    // Suscribirse a estadísticas de moderación
    this.sellerService.moderationStats$.subscribe(stats => {
      this.moderationStats = stats;
    });
  }

  loadData() {
    this.isLoading = true;
    this.isLoadingBrands = true;

    // Cargar perfumes
    this.sellerService.getMyPerfumes(0, 50, '', this.moderationFilter !== 'ALL' ? this.moderationFilter : undefined)
      .subscribe({
        next: (response) => {
          this.perfumes = response.data || [];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading perfumes:', error);
          this.isLoading = false;
        }
      });

    // Cargar marcas
    this.sellerService.getMyBrands('', this.brandModerationFilter !== 'ALL' ? this.brandModerationFilter : undefined)
      .subscribe({
        next: (brands) => {
          this.brands = brands;
          this.calculateBrandStats();
          this.isLoadingBrands = false;
        },
        error: (error) => {
          console.error('Error loading brands:', error);
          this.isLoadingBrands = false;
        }
      });
  }

  calculateBrandStats() {
    this.brandModerationStats = {
      approved: this.brands.filter(b => b.moderationStatus === ModerationStatus.APPROVED).length,
      pending: this.brands.filter(b => b.moderationStatus === ModerationStatus.PENDING_REVIEW).length,
      rejected: this.brands.filter(b => b.moderationStatus === ModerationStatus.REJECTED).length,
      draft: this.brands.filter(b => b.moderationStatus === ModerationStatus.DRAFT).length
    };
  }

  // ============= FILTROS DE MODERACIÓN =============
  onModerationFilterChange(event: any) {
    this.moderationFilter = event.detail.value;
    this.loadData();
  }

  onBrandModerationFilterChange(event: any) {
    this.brandModerationFilter = event.detail.value;
    this.loadData();
  }

  getFilteredPerfumes(): Perfume[] {
    if (this.moderationFilter === 'ALL') return this.perfumes;
    return this.perfumes.filter(p => p.moderationStatus === this.moderationFilter);
  }

  getFilteredBrands(): Brand[] {
    if (this.brandModerationFilter === 'ALL') return this.brands;
    return this.brands.filter(b => b.moderationStatus === this.brandModerationFilter);
  }

  // ============= MÉTODOS EXISTENTES ACTUALIZADOS =============
  openAddProductStepper() {
    if (!this.sellerService.canCreatePerfume()) {
      const user = this.authService.getCurrentUser();
      alert('No tienes permisos para crear perfumes. Tu rol actual es: ' + (user?.role || 'No definido'));
      return;
    }
    this.stepperService.openStepper();
  }

  getPerfumeImage(perfume: Perfume): string {
    if (perfume.imageUrl) {
      return perfume.imageUrl;
    }
    return 'assets/images/default-perfume.jpg';
  }

  getBrandImage(brand: Brand): string {
    if (brand.imageUrl) {
      return brand.imageUrl;
    }
    return 'assets/images/default-brand.jpg';
  }

  onImageError(perfume: Perfume) {
    console.log('Image error for perfume:', perfume.name);
  }

  onImageLoad(perfume: Perfume) {
    console.log('Image loaded for perfume:', perfume.name);
  }

  onBrandImageError(brand: Brand) {
    console.log('Image error for brand:', brand.name);
  }

  onBrandImageLoad(brand: Brand) {
    console.log('Image loaded for brand:', brand.name);
  }

  getTotalStock(): number {
    return this.perfumes.reduce((total, perfume) => total + (perfume.stock || 0), 0);
  }

  getUniqueBrands(): number {
    const brandIds = new Set(this.perfumes.map(p => p.brandId).filter(id => id !== undefined));
    return brandIds.size;
  }

  getLowStockCount(): number {
    return this.perfumes.filter(p => (p.stock || 0) < 10).length;
  }

  // ============= GESTIÓN DE SELECCIÓN =============
  toggleSelectPerfume(perfumeId: number) {
    if (this.selectedPerfumes.has(perfumeId)) {
      this.selectedPerfumes.delete(perfumeId);
    } else {
      this.selectedPerfumes.add(perfumeId);
    }
  }

  isSelected(perfumeId: number): boolean {
    return this.selectedPerfumes.has(perfumeId);
  }

  deleteSelectedPerfumes() {
    const selectedIds = Array.from(this.selectedPerfumes);
    if (selectedIds.length === 0) return;

    if (confirm(`¿Estás seguro de que quieres eliminar ${selectedIds.length} perfume(s)?`)) {
      selectedIds.forEach(id => {
        this.sellerService.deletePerfume(id).subscribe({
          next: () => {
            this.selectedPerfumes.delete(id);
          },
          error: (error) => {
            console.error('Error deleting perfume:', error);
          }
        });
      });
      this.selectedPerfumes.clear();
    }
  }

  // ============= GESTIÓN DE MARCAS =============
  openCreateBrand() {
    this.isCreateModalOpen = true;
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
    this.newBrand = { name: '', description: '', countryOrigin: '', imageUrl: '' };
  }

  isValidBrand(): boolean {
    return this.newBrand.name.trim().length > 0 && this.newBrand.description.trim().length > 0;
  }

  createBrand() {
    if (!this.isValidBrand()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    this.sellerService.createMyBrand(this.newBrand).subscribe({
      next: (brand) => {
        this.brands.push(brand);
        this.closeCreateModal();
        alert('Marca creada exitosamente');
        this.loadData(); // Recargar para actualizar estadísticas
      },
      error: (error) => {
        console.error('Error creating brand:', error);
        alert('Error creando la marca: ' + error.message);
      }
    });
  }

  deleteBrand(brandId: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta marca?')) {
      // Aquí deberías implementar el método deleteBrand en el servicio
      alert('Funcionalidad de eliminar marca no implementada aún');
    }
  }

  viewBrandPerfumes(brand: Brand) {
    console.log('Viewing perfumes for brand:', brand.name);
    // Implementar navegación a página de perfumes de la marca
  }

  // ============= GESTIÓN DE PERFUMES =============
  startEditPerfume(perfume: Perfume) {
    console.log('Editing perfume:', perfume.name);
    // Implementar edición de perfume
  }

  deletePerfume(perfumeId: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este perfume?')) {
      this.sellerService.deletePerfume(perfumeId).subscribe({
        next: () => {
          this.perfumes = this.perfumes.filter(p => p.id !== perfumeId);
          alert('Perfume eliminado exitosamente');
        },
        error: (error) => {
          console.error('Error deleting perfume:', error);
          alert('Error eliminando el perfume: ' + error.message);
        }
      });
    }
  }

  viewPerfumeDetails(perfume: Perfume) {
    console.log('Viewing details for perfume:', perfume.name);
    // Implementar vista de detalles del perfume
  }

  onBackClick() {
    this.router.navigate(['/home']);
  }
}