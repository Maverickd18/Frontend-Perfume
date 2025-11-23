import { Component, OnInit } from '@angular/core';
import { SellerService, Perfume } from '../../services/seller.service';
import { NotificationService } from '../../services/notification.service';
import { StepperService } from '../../services/stepper.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.page.html',
  styleUrls: ['./seller.page.scss'],
  standalone: false
})
export class SellerPage implements OnInit {

  perfumes: Perfume[] = [];
  selectedPerfumes: Set<number> = new Set();
  unreadNotifications = 0;
  
  editingPerfume: Perfume | null = null;
  isLoading = false;
  currentPage = 0;
  pageSize = 50;

  // Propiedades para modal de imagen de marca
  isBrandImageModalOpen = false;
  selectedBrand: any = null;
  selectedBrandImage: File | null = null;
  brandImagePreview: string | null = null;

  // Propiedades para modal de imagen de categoría
  isCategoryImageModalOpen = false;
  selectedCategory: any = null;
  selectedCategoryImage: File | null = null;
  categoryImagePreview: string | null = null;

  // Propiedades para crear marcas
  isCreateBrandModalOpen = false;
  editingBrand: any = null;
  newBrand = {
    name: '',
    description: '',
    countryOrigin: '',
    imageUrl: ''
  };

  // Propiedades para crear categorías
  isCreateCategoryModalOpen = false;
  editingCategory: any = null;
  newCategory = {
    name: '',
    description: '',
    imageUrl: ''
  };

  // Arrays para marcas y categorías
  brands: any[] = [];
  categories: any[] = [];

  // Estados de filtrado y búsqueda
  activeTab: string = 'perfumes';
  moderationFilter: string = 'ALL';
  searchTerm: string = '';
  ModerationStatus: any = {
    APPROVED: 'APPROVED',
    PENDING: 'PENDING',
    REJECTED: 'REJECTED',
    DRAFT: 'DRAFT'
  };

  // Estadísticas de moderación
  moderationStats: any = {
    approved: 0,
    pending: 0,
    rejected: 0,
    draft: 0
  };

  constructor(
    private sellerService: SellerService, 
    private notificationService: NotificationService,
    private stepperService: StepperService,
    private router: Router, 
    private location: Location
  ) {}

  ngOnInit() {
    this.loadPerfumes();
    
    this.sellerService.perfumes$.subscribe(perfumes => {
      this.perfumes = perfumes;
    });

    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadNotifications = count;
    });

    this.sellerService.initializeData();
    
    // Agregar producto de muestra para visualización
    this.addSampleProduct();
  }

  addSampleProduct() {
    const samplePerfume: Perfume = {
      id: 999,
      name: 'Sauvage Eau de Parfum',
      description: 'Una fragancia icónica que combina notas frescas de bergamota con toques especiados de pimienta Sichuan y un fondo amaderado de ámbar gris. Perfecta para el hombre moderno y sofisticado.',
      price: 125.99,
      stock: 45,
      sizeMl: 100,
      genre: 'Masculino',
      releaseDate: '2023-06-15',
      brandId: 1,
      categoryId: 2,
      imageUrl: 'https://fimgs.net/mdimg/perfume/375x500.68668.jpg',
      brand: {
        id: 1,
        name: 'Dior',
        description: 'Casa de moda francesa de lujo',
        countryOrigin: 'Francia',
        imageUrl: 'https://example.com/dior-logo.jpg'
      },
      category: {
        id: 2,
        name: 'Eau de Parfum',
        description: 'Concentración de fragancia alta'
      }
    };
    
    // Agregar el producto de muestra al array si no existe
    if (!this.perfumes.find(p => p.id === 999)) {
      this.perfumes = [samplePerfume, ...this.perfumes];
    }
  }

  loadPerfumes() {
    this.isLoading = true;
    this.sellerService.getMyPerfumes(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Perfumes loaded successfully');
      },
      error: (error) => {
        console.error('Error loading perfumes:', error);
        this.isLoading = false;
        alert('Error loading perfumes: ' + error.message);
      }
    });
  }

  openAddProductStepper() {
    this.stepperService.openStepper();
  }

  toggleSelectPerfume(id: number) {
    if (this.selectedPerfumes.has(id)) {
      this.selectedPerfumes.delete(id);
    } else {
      this.selectedPerfumes.add(id);
    }
  }

  isSelected(id: number): boolean {
    return this.selectedPerfumes.has(id);
  }

  deleteSelectedPerfumes() {
    if (this.selectedPerfumes.size === 0) {
      alert('Please select at least one product to delete');
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${this.selectedPerfumes.size} product(s)?`)) {
      const deletePromises = Array.from(this.selectedPerfumes).map(id => 
        this.sellerService.deletePerfume(id).toPromise()
      );

      Promise.all(deletePromises).then(() => {
        this.selectedPerfumes.clear();
        this.loadPerfumes(); // Recargar la lista
      }).catch(error => {
        console.error('Error deleting perfumes:', error);
        alert('Error deleting some products. Please try again.');
      });
    }
  }

  startEditPerfume(perfume: Perfume) {
    this.editingPerfume = { ...perfume };
  }

  saveEditPerfume() {
    if (!this.editingPerfume || !this.editingPerfume.id) return;
    
    if (!this.editingPerfume.name.trim() || !this.editingPerfume.description.trim() || 
        this.editingPerfume.price <= 0 || this.editingPerfume.stock < 0 || this.editingPerfume.sizeMl <= 0) {
      alert('Please complete all fields correctly');
      return;
    }

    this.sellerService.updatePerfume(this.editingPerfume.id, this.editingPerfume).subscribe({
      next: () => {
        this.editingPerfume = null;
        this.loadPerfumes(); // Recargar la lista
      },
      error: (error) => {
        console.error('Error updating perfume:', error);
        alert('Error updating product. Please try again.');
      }
    });
  }

  cancelEditPerfume() {
    this.editingPerfume = null;
  }

  deletePerfume(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.sellerService.deletePerfume(id).subscribe({
        next: () => {
          this.loadPerfumes(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error deleting perfume:', error);
          alert('Error deleting product. Please try again.');
        }
      });
    }
  }

  onBackClick() {
    this.location.back();
  }

  // Método para obtener la imagen del perfume
  getPerfumeImage(perfume: Perfume): string {
    if (perfume.imageUrl && perfume.imageUrl !== '/uploads/default-perfume.jpg') {
      return `http://localhost:8080/uploads/${perfume.imageUrl}`;
    }
    return 'assets/images/default-perfume.jpg';
  }

  // Método para obtener la imagen de la marca
  getBrandImage(brand: any): string {
    if (brand.imageUrl && brand.imageUrl !== '/uploads/default-brand.jpg') {
      return `http://localhost:8080/uploads/${brand.imageUrl}`;
    }
    return 'assets/images/default-brand.jpg';
  }

  // Método para obtener la imagen de la categoría
  getCategoryImage(category: any): string {
    if (category.imageUrl && category.imageUrl !== '/uploads/default-category.jpg') {
      return `http://localhost:8080/uploads/${category.imageUrl}`;
    }
    return 'assets/images/default-category.jpg';
  }

  // Método para manejar error de imagen
  onImageError(perfume: Perfume) {
    perfume.imageUrl = undefined;
  }

  // Método para ver detalles del perfume
  viewPerfumeDetails(perfume: Perfume) {
    console.log('Ver detalles:', perfume);
    // Aquí puedes abrir un modal o navegar a una página de detalles
  }

  // Métodos para modal de imagen de marca
  openBrandImageModal(brand: any) {
    this.selectedBrand = brand;
    this.isBrandImageModalOpen = true;
  }

  closeBrandImageModal() {
    this.isBrandImageModalOpen = false;
    this.selectedBrand = null;
    this.selectedBrandImage = null;
    this.brandImagePreview = null;
  }

  onBrandImageUploadSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedBrandImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.brandImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadBrandImage() {
    if (!this.selectedBrandImage || !this.selectedBrand) {
      alert('Por favor selecciona una imagen');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedBrandImage);

    // Aquí deberías llamar a tu servicio de upload
    console.log('Uploading brand image:', this.selectedBrandImage);
    // this.fileUploadService.uploadBrandImage(this.selectedBrand.id, formData).subscribe({...});
    
    alert('Imagen de marca actualizada');
    this.closeBrandImageModal();
  }

  // Métodos para modal de imagen de categoría
  openCategoryImageModal(category: any) {
    this.selectedCategory = category;
    this.isCategoryImageModalOpen = true;
  }

  closeCategoryImageModal() {
    this.isCategoryImageModalOpen = false;
    this.selectedCategory = null;
    this.selectedCategoryImage = null;
    this.categoryImagePreview = null;
  }

  onCategoryImageUploadSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedCategoryImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.categoryImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadCategoryImage() {
    if (!this.selectedCategoryImage || !this.selectedCategory) {
      alert('Por favor selecciona una imagen');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedCategoryImage);

    // Aquí deberías llamar a tu servicio de upload
    console.log('Uploading category image:', this.selectedCategoryImage);
    // this.fileUploadService.uploadCategoryImage(this.selectedCategory.id, formData).subscribe({...});
    
    alert('Imagen de categoría actualizada');
    this.closeCategoryImageModal();
  }

  // Métodos para crear/actualizar marcas
  openCreateBrandModal() {
    this.editingBrand = null;
    this.newBrand = { name: '', description: '', countryOrigin: '', imageUrl: '' };
    this.isCreateBrandModalOpen = true;
  }

  closeCreateBrandModal() {
    this.isCreateBrandModalOpen = false;
    this.editingBrand = null;
    this.newBrand = { name: '', description: '', countryOrigin: '', imageUrl: '' };
  }

  createBrand() {
    if (!this.isValidBrand()) {
      alert('Por favor completa todos los campos');
      return;
    }
    console.log('Creating brand:', this.newBrand);
    alert('Marca creada exitosamente');
    this.closeCreateBrandModal();
  }

  updateBrand() {
    if (!this.isValidBrand()) {
      alert('Por favor completa todos los campos');
      return;
    }
    console.log('Updating brand:', this.newBrand);
    alert('Marca actualizada exitosamente');
    this.closeCreateBrandModal();
  }

  isValidBrand(): boolean {
    return this.newBrand.name.trim().length > 0 && 
           this.newBrand.description.trim().length > 0;
  }

  onBrandImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newBrand.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Métodos para crear/actualizar categorías
  openCreateCategoryModal() {
    this.editingCategory = null;
    this.newCategory = { name: '', description: '', imageUrl: '' };
    this.isCreateCategoryModalOpen = true;
  }

  closeCreateCategoryModal() {
    this.isCreateCategoryModalOpen = false;
    this.editingCategory = null;
    this.newCategory = { name: '', description: '', imageUrl: '' };
  }

  createCategory() {
    if (!this.isValidCategory()) {
      alert('Por favor completa todos los campos');
      return;
    }
    console.log('Creating category:', this.newCategory);
    alert('Categoría creada exitosamente');
    this.closeCreateCategoryModal();
  }

  updateCategory() {
    if (!this.isValidCategory()) {
      alert('Por favor completa todos los campos');
      return;
    }
    console.log('Updating category:', this.newCategory);
    alert('Categoría actualizada exitosamente');
    this.closeCreateCategoryModal();
  }

  isValidCategory(): boolean {
    return this.newCategory.name.trim().length > 0 && 
           this.newCategory.description.trim().length > 0;
  }

  onCategoryImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newCategory.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Métodos para filtrado y búsqueda
  getFilteredPerfumes(): Perfume[] {
    return this.perfumes.filter(p => {
      const matchesFilter = this.moderationFilter === 'ALL' || p.moderationStatus === this.moderationFilter;
      const matchesSearch = p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           p.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }

  getFilteredBrands(): any[] {
    return this.brands.filter(b => {
      const matchesFilter = this.moderationFilter === 'ALL' || b.moderationStatus === this.moderationFilter;
      const matchesSearch = b.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }

  getFilteredCategories(): any[] {
    return this.categories.filter(c => {
      const matchesFilter = this.moderationFilter === 'ALL' || c.moderationStatus === this.moderationFilter;
      const matchesSearch = c.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }

  onModerationFilterChange(event: any) {
    this.moderationFilter = event.detail.value;
  }

  onSearchPerfumes(event: any) {
    this.searchTerm = event.detail.value;
  }

  getTruncatedDescription(description: string, maxLength: number): string {
    if (description && description.length > maxLength) {
      return description.substring(0, maxLength) + '...';
    }
    return description || '';
  }

  getModerationStatusText(status: string): string {
    const statusMap: any = {
      'APPROVED': 'Aprobado',
      'PENDING': 'Pendiente',
      'REJECTED': 'Rechazado',
      'DRAFT': 'Borrador'
    };
    return statusMap[status] || status;
  }

  // Métodos para editar perfumes
  editPerfume(perfume: Perfume) {
    this.startEditPerfume(perfume);
  }

  // Métodos para marcas
  openCreateBrand() {
    this.openCreateBrandModal();
  }

  editBrand(brand: any) {
    this.editingBrand = brand;
    this.newBrand = { ...brand };
    this.isCreateBrandModalOpen = true;
  }

  deleteBrand(brandId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta marca?')) {
      console.log('Deleting brand:', brandId);
      alert('Marca eliminada');
    }
  }

  viewBrandPerfumes(brand: any) {
    console.log('Viewing perfumes for brand:', brand);
  }

  onBrandImageError(brand: any) {
    brand.imageUrl = undefined;
  }

  openBrandImageUpload(brand: any) {
    this.openBrandImageModal(brand);
  }

  // Métodos para categorías
  openCreateCategory() {
    this.openCreateCategoryModal();
  }

  editCategory(category: any) {
    this.editingCategory = category;
    this.newCategory = { ...category };
    this.isCreateCategoryModalOpen = true;
  }

  deleteCategory(categoryId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      console.log('Deleting category:', categoryId);
      alert('Categoría eliminada');
    }
  }

  onCategoryImageError(category: any) {
    category.imageUrl = undefined;
  }

  openCategoryImageUpload(category: any) {
    this.openCategoryImageModal(category);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  onTabChange(event: any) {
    this.activeTab = event.detail.value;
  }
}
