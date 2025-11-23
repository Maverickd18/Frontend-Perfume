import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SellerService, Perfume, Brand, Category, ModerationStatus, ModerationStats } from '../../services/seller.service';
import { StepperService } from '../../services/stepper.service';
import { AuthService } from '../../services/auth.service';

interface Tab {
  id: string;
  name: string;
  icon: string;
  count: number;
}

@Component({
  selector: 'app-seller',
  templateUrl: './seller.page.html',
  styleUrls: ['./seller.page.scss'],
  standalone: false
})
export class SellerPage implements OnInit {
  perfumes: Perfume[] = [];
  brands: Brand[] = [];
  categories: Category[] = [];
  activeTab: string = 'overview';
  isLoading = false;
  unreadNotifications = 0;

  // Tabs configuration
  tabs: Tab[] = [
    { id: 'overview', name: 'Resumen', icon: 'grid', count: 0 },
    { id: 'perfumes', name: 'Perfumes', icon: 'flask', count: 0 },
    { id: 'brands', name: 'Marcas', icon: 'business', count: 0 },
    { id: 'categories', name: 'Categorías', icon: 'list', count: 0 }
  ];

  // Filtros
  moderationFilter: ModerationStatus | 'ALL' = 'ALL';
  searchTerm: string = '';
  sortBy: string = 'recent';

  // Estadísticas
  moderationStats: ModerationStats = { approved: 0, pending: 0, rejected: 0, draft: 0 };

  // Datos para secciones
  recentPerfumes: Perfume[] = [];

  // Modales
  isCreateBrandModalOpen = false;
  isCreateCategoryModalOpen = false;
  isBrandImageModalOpen = false;
  isCategoryImageModalOpen = false;

  // Estados de edición
  editingBrand: Brand | null = null;
  editingCategory: Category | null = null;

  // Nuevos objetos
  newBrand = {
    name: '',
    description: '',
    countryOrigin: '',
    imageUrl: ''
  };

  newCategory = {
    name: '',
    description: '',
    imageUrl: ''
  };

  // Para carga de imágenes
  selectedBrand: Brand | null = null;
  selectedCategory: Category | null = null;
  selectedBrandImage: File | null = null;
  selectedCategoryImage: File | null = null;
  brandImagePreview: string | null = null;
  categoryImagePreview: string | null = null;

  ModerationStatus = ModerationStatus;

  constructor(
    private sellerService: SellerService,
    private stepperService: StepperService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.isLoading = true;
    
    // Cargar todos los datos iniciales
    Promise.all([
      this.loadPerfumes(),
      this.loadBrands(),
      this.loadCategories()
    ]).finally(() => {
      this.updateTabCounts();
      this.updateModerationStats();
      this.updateRecentPerfumes();
      this.isLoading = false;
    });
  }

  loadPerfumes() {
    return new Promise<void>((resolve) => {
      this.sellerService.getMyPerfumes(0, 50, '', this.moderationFilter !== 'ALL' ? this.moderationFilter : undefined)
        .subscribe({
          next: (response) => {
            this.perfumes = response.data || [];
            resolve();
          },
          error: (error: any) => {
            console.error('Error loading perfumes:', error);
            resolve();
          }
        });
    });
  }

  loadBrands() {
    return new Promise<void>((resolve) => {
      this.sellerService.getMyBrands()
        .subscribe({
          next: (brands) => {
            this.brands = brands;
            resolve();
          },
          error: (error: any) => {
            console.error('Error loading brands:', error);
            resolve();
          }
        });
    });
  }

  loadCategories() {
    return new Promise<void>((resolve) => {
      this.sellerService.getCategories()
        .subscribe({
          next: (categories) => {
            this.categories = categories;
            resolve();
          },
          error: (error: any) => {
            console.error('Error loading categories:', error);
            resolve();
          }
        });
    });
  }

  updateTabCounts() {
    this.tabs = this.tabs.map(tab => {
      switch (tab.id) {
        case 'perfumes':
          return { ...tab, count: this.perfumes.length };
        case 'brands':
          return { ...tab, count: this.brands.length };
        case 'categories':
          return { ...tab, count: this.categories.length };
        default:
          return { ...tab, count: 0 };
      }
    });
  }

  updateModerationStats() {
    this.moderationStats = {
      approved: this.perfumes.filter(p => p.moderationStatus === ModerationStatus.APPROVED).length,
      pending: this.perfumes.filter(p => p.moderationStatus === ModerationStatus.PENDING_REVIEW).length,
      rejected: this.perfumes.filter(p => p.moderationStatus === ModerationStatus.REJECTED).length,
      draft: this.perfumes.filter(p => p.moderationStatus === ModerationStatus.DRAFT).length
    };
  }

  updateRecentPerfumes() {
    // Tomar los últimos 4 perfumes como recientes
    this.recentPerfumes = [...this.perfumes]
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 4);
  }

  // ============= NAVEGACIÓN ENTRE TABS =============
  onTabChange(event: any) {
    this.activeTab = event.detail.value;
  }

  switchToTab(tabId: string) {
    this.activeTab = tabId;
  }

  // ============= GESTIÓN DE PERFUMES =============
  openAddProductStepper() {
    if (!this.sellerService.canCreatePerfume()) {
      const user = this.authService.getCurrentUser();
      alert('No tienes permisos para crear perfumes. Tu rol actual es: ' + (user?.role || 'No definido'));
      return;
    }
    this.stepperService.openStepper();
  }

  editPerfume(perfume: Perfume) {
    console.log('Editando perfume:', perfume);
    this.stepperService.openStepper();
    this.stepperService.updatePerfumeData({
      name: perfume.name,
      description: perfume.description,
      price: perfume.price,
      stock: perfume.stock,
      sizeMl: perfume.sizeMl,
      genre: perfume.genre || 'MASCULINO',
      releaseDate: perfume.releaseDate || new Date().toISOString().split('T')[0],
      imageUrl: perfume.imageUrl || ''
    });
    if (perfume.brandId) {
      this.stepperService.selectBrand(perfume.brandId);
    }
    if (perfume.categoryId) {
      this.stepperService.selectCategory(perfume.categoryId);
    }
  }

  deletePerfume(perfumeId: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este perfume?')) {
      this.sellerService.deletePerfume(perfumeId).subscribe({
        next: () => {
          this.perfumes = this.perfumes.filter(p => p.id !== perfumeId);
          this.updateTabCounts();
          this.updateModerationStats();
          this.updateRecentPerfumes();
          this.showToast('Perfume eliminado exitosamente', 'success');
        },
        error: (error: any) => {
          console.error('Error deleting perfume:', error);
          this.showToast('Error eliminando el perfume: ' + error.message, 'error');
        }
      });
    }
  }

  viewPerfumeDetails(perfume: Perfume) {
    console.log('Viendo detalles del perfume:', perfume);
    this.router.navigate(['/perfume-details', perfume.id]);
  }

  // ============= GESTIÓN DE MARCAS =============
  openCreateBrand() {
    this.editingBrand = null;
    this.newBrand = { name: '', description: '', countryOrigin: '', imageUrl: '' };
    this.isCreateBrandModalOpen = true;
  }

  editBrand(brand: Brand) {
    this.editingBrand = brand;
    this.newBrand = {
      name: brand.name,
      description: brand.description,
      countryOrigin: brand.countryOrigin || '',
      imageUrl: brand.imageUrl || ''
    };
    this.isCreateBrandModalOpen = true;
  }

  updateBrand() {
    if (!this.editingBrand || !this.isValidBrand()) {
      this.showToast('Por favor completa todos los campos obligatorios', 'warning');
      return;
    }

    this.sellerService.updateMyBrand(this.editingBrand.id!, this.newBrand).subscribe({
      next: (brand) => {
        const index = this.brands.findIndex(b => b.id === brand.id);
        if (index !== -1) {
          this.brands[index] = brand;
        }
        this.closeCreateBrandModal();
        this.showToast('Marca actualizada exitosamente', 'success');
      },
      error: (error: any) => {
        console.error('Error updating brand:', error);
        this.showToast('Error actualizando la marca: ' + error.message, 'error');
      }
    });
  }

  createBrand() {
    if (!this.isValidBrand()) {
      this.showToast('Por favor completa todos los campos obligatorios', 'warning');
      return;
    }

    this.sellerService.createMyBrand(this.newBrand).subscribe({
      next: (brand) => {
        this.brands.push(brand);
        this.updateTabCounts();
        this.closeCreateBrandModal();
        this.showToast('Marca creada exitosamente', 'success');
      },
      error: (error: any) => {
        console.error('Error creating brand:', error);
        this.showToast('Error creando la marca: ' + error.message, 'error');
      }
    });
  }

  deleteBrand(brandId: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta marca?')) {
      this.sellerService.deleteMyBrand(brandId).subscribe({
        next: () => {
          this.brands = this.brands.filter(b => b.id !== brandId);
          this.updateTabCounts();
          this.showToast('Marca eliminada exitosamente', 'success');
        },
        error: (error: any) => {
          console.error('Error deleting brand:', error);
          this.showToast('Error eliminando la marca: ' + error.message, 'error');
        }
      });
    }
  }

  viewBrandPerfumes(brand: Brand) {
    console.log('Viendo perfumes de la marca:', brand.name);
    this.activeTab = 'perfumes';
  }

  // ============= GESTIÓN DE CATEGORÍAS =============
  openCreateCategory() {
    this.editingCategory = null;
    this.newCategory = { name: '', description: '', imageUrl: '' };
    this.isCreateCategoryModalOpen = true;
  }

  editCategory(category: Category) {
    this.editingCategory = category;
    this.newCategory = {
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl || ''
    };
    this.isCreateCategoryModalOpen = true;
  }

  updateCategory() {
    if (!this.editingCategory || !this.isValidCategory()) {
      this.showToast('Por favor completa todos los campos obligatorios', 'warning');
      return;
    }

    this.sellerService.updateCategory(this.editingCategory.id!, this.newCategory).subscribe({
      next: (category) => {
        const index = this.categories.findIndex(c => c.id === category.id);
        if (index !== -1) {
          this.categories[index] = category;
        }
        this.closeCreateCategoryModal();
        this.showToast('Categoría actualizada exitosamente', 'success');
      },
      error: (error: any) => {
        console.error('Error updating category:', error);
        this.showToast('Error actualizando la categoría: ' + error.message, 'error');
      }
    });
  }

  createCategory() {
    if (!this.isValidCategory()) {
      this.showToast('Por favor completa todos los campos obligatorios', 'warning');
      return;
    }

    this.sellerService.createCategory(this.newCategory).subscribe({
      next: (category) => {
        this.categories.push(category);
        this.updateTabCounts();
        this.closeCreateCategoryModal();
        this.showToast('Categoría creada exitosamente', 'success');
      },
      error: (error: any) => {
        console.error('Error creating category:', error);
        this.showToast('Error creando la categoría: ' + error.message, 'error');
      }
    });
  }

  deleteCategory(categoryId: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      this.sellerService.deleteCategory(categoryId).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c.id !== categoryId);
          this.updateTabCounts();
          this.showToast('Categoría eliminada exitosamente', 'success');
        },
        error: (error: any) => {
          console.error('Error deleting category:', error);
          this.showToast('Error eliminando la categoría: ' + error.message, 'error');
        }
      });
    }
  }

  // ============= GESTIÓN DE IMÁGENES DE MARCAS =============
  openBrandImageUpload(brand: Brand) {
    this.selectedBrand = brand;
    this.selectedBrandImage = null;
    this.brandImagePreview = null;
    this.isBrandImageModalOpen = true;
  }

  closeBrandImageModal() {
    this.isBrandImageModalOpen = false;
    this.selectedBrand = null;
    this.selectedBrandImage = null;
    this.brandImagePreview = null;
  }

  onBrandImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.processBrandImage(file);
    }
  }

  onBrandImageUploadSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedBrandImage = file;
      this.processBrandImage(file);
    }
  }

  processBrandImage(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      this.showToast('La imagen es demasiado grande. Máximo 5MB.', 'error');
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.showToast('Por favor selecciona un archivo de imagen válido.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.brandImagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  uploadBrandImage() {
    if (!this.selectedBrand || !this.selectedBrandImage) {
      this.showToast('Por favor selecciona una imagen', 'warning');
      return;
    }

    this.sellerService.uploadBrandImage(this.selectedBrand.id!, this.selectedBrandImage).subscribe({
      next: (response: any) => {
        const index = this.brands.findIndex(b => b.id === this.selectedBrand!.id);
        if (index !== -1 && response.imageUrl) {
          this.brands[index].imageUrl = response.imageUrl;
        }
        this.closeBrandImageModal();
        this.showToast('Imagen de marca actualizada exitosamente', 'success');
      },
      error: (error: any) => {
        console.error('Error uploading brand image:', error);
        this.showToast('Error subiendo la imagen: ' + error.message, 'error');
      }
    });
  }

  // ============= GESTIÓN DE IMÁGENES DE CATEGORÍAS =============
  openCategoryImageUpload(category: Category) {
    this.selectedCategory = category;
    this.selectedCategoryImage = null;
    this.categoryImagePreview = null;
    this.isCategoryImageModalOpen = true;
  }

  closeCategoryImageModal() {
    this.isCategoryImageModalOpen = false;
    this.selectedCategory = null;
    this.selectedCategoryImage = null;
    this.categoryImagePreview = null;
  }

  onCategoryImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.processCategoryImage(file);
    }
  }

  onCategoryImageUploadSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedCategoryImage = file;
      this.processCategoryImage(file);
    }
  }

  processCategoryImage(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      this.showToast('La imagen es demasiado grande. Máximo 5MB.', 'error');
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.showToast('Por favor selecciona un archivo de imagen válido.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.categoryImagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  uploadCategoryImage() {
    if (!this.selectedCategory || !this.selectedCategoryImage) {
      this.showToast('Por favor selecciona una imagen', 'warning');
      return;
    }

    this.sellerService.uploadCategoryImage(this.selectedCategory.id!, this.selectedCategoryImage).subscribe({
      next: (response: any) => {
        const index = this.categories.findIndex(c => c.id === this.selectedCategory!.id);
        if (index !== -1 && response.imageUrl) {
          this.categories[index].imageUrl = response.imageUrl;
        }
        this.closeCategoryImageModal();
        this.showToast('Imagen de categoría actualizada exitosamente', 'success');
      },
      error: (error: any) => {
        console.error('Error uploading category image:', error);
        this.showToast('Error subiendo la imagen: ' + error.message, 'error');
      }
    });
  }

  // ============= FILTROS Y BÚSQUEDA =============
  onModerationFilterChange(event: any) {
    this.moderationFilter = event.detail.value;
    this.loadPerfumes().then(() => {
      this.updateModerationStats();
      this.updateRecentPerfumes();
    });
  }

  onSearchPerfumes(event: any) {
    this.searchTerm = event.detail.value;
  }

  onSortChange(event: any) {
    this.sortBy = event.detail.value;
    this.sortPerfumes();
  }

  sortPerfumes() {
    switch (this.sortBy) {
      case 'name':
        this.perfumes.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price':
        this.perfumes.sort((a, b) => a.price - b.price);
        break;
      case 'recent':
      default:
        this.perfumes.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
    }
  }

  getFilteredPerfumes(): Perfume[] {
    let filtered = this.perfumes;

    if (this.moderationFilter !== 'ALL') {
      filtered = filtered.filter(p => p.moderationStatus === this.moderationFilter);
    }

    if (this.searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    return filtered;
  }

  getFilteredBrands(): Brand[] {
    return this.brands;
  }

  // ============= UTILIDADES =============
  getPerfumeImage(perfume: Perfume): string {
    return perfume.imageUrl || 'assets/images/default-perfume.jpg';
  }

  getBrandImage(brand: Brand): string {
    return brand.imageUrl || 'assets/images/default-brand.jpg';
  }

  getCategoryImage(category: Category): string {
    return category.imageUrl || 'assets/images/default-category.jpg';
  }

  onImageError(perfume: Perfume) {
    console.log('Error cargando imagen del perfume:', perfume.name);
  }

  onBrandImageError(brand: Brand) {
    console.log('Error cargando imagen de la marca:', brand.name);
  }

  onCategoryImageError(category: Category) {
    console.log('Error cargando imagen de la categoría:', category.name);
  }

  getModerationStatusText(status: ModerationStatus | undefined): string {
    switch (status) {
      case ModerationStatus.APPROVED: return 'Aprobado';
      case ModerationStatus.PENDING_REVIEW: return 'En Revisión';
      case ModerationStatus.REJECTED: return 'Rechazado';
      case ModerationStatus.DRAFT: return 'Borrador';
      default: return 'Desconocido';
    }
  }

  getTruncatedDescription(description: string | undefined, limit: number = 100): string {
    if (!description) return '';
    
    if (description.length <= limit) {
      return description;
    }
    
    return description.substr(0, limit) + '...';
  }

  isValidBrand(): boolean {
    return this.newBrand.name.trim().length > 0 && 
           this.newBrand.description.trim().length > 0;
  }

  isValidCategory(): boolean {
    return this.newCategory.name.trim().length > 0 && 
           this.newCategory.description.trim().length > 0;
  }

  closeCreateBrandModal() {
    this.isCreateBrandModalOpen = false;
    this.editingBrand = null;
    this.newBrand = { name: '', description: '', countryOrigin: '', imageUrl: '' };
  }

  closeCreateCategoryModal() {
    this.isCreateCategoryModalOpen = false;
    this.editingCategory = null;
    this.newCategory = { name: '', description: '', imageUrl: '' };
  }

  showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // Aquí puedes implementar un servicio de toast real
    alert(message);
  }

  goToProfile() {
    this.router.navigate(['/seller-profile']);
  }

  onBackClick() {
    this.router.navigate(['/home']);
  }
}