import { Component, OnInit } from '@angular/core';
import { SellerService, Perfume, Brand } from '../../services/seller.service';
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
  unreadNotifications = 0;
  
  // Brands functionality
  brands: Brand[] = [];
  showBrandsSection = false;
  isLoadingBrands = false;
  
  editingPerfume: Perfume | null = null;
  isLoading = false;
  currentPage = 0;
  pageSize = 50;

  // Brand modal state
  isCreateModalOpen = false;
  newBrand = {
    name: '',
    description: '',
    countryOrigin: '',
    imageUrl: ''
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
    
    // Suscribirse a los perfumes
    this.sellerService.perfumes$.subscribe(perfumes => {
      this.perfumes = perfumes;
      console.log('📦 Perfumes updated in component:', this.perfumes);
    });

    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadNotifications = count;
    });

    // Inicializar datos
    this.sellerService.initializeData();
  }

  // 🔥 BRANDS METHODS
  loadBrands() {
    this.isLoadingBrands = true;
    this.sellerService.getMyBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
        this.isLoadingBrands = false;
        console.log('✅ Brands loaded successfully:', this.brands.length);
      },
      error: (error) => {
        console.error('❌ Error loading brands:', error);
        this.isLoadingBrands = false;
      }
    });
  }

  toggleBrandsSection() {
    this.showBrandsSection = !this.showBrandsSection;
    if (this.showBrandsSection && this.brands.length === 0) {
      this.loadBrands();
    }
  }

  openCreateBrand() {
    this.isCreateModalOpen = true;
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
    this.resetNewBrand();
  }

  resetNewBrand() {
    this.newBrand = {
      name: '',
      description: '',
      countryOrigin: '',
      imageUrl: ''
    };
  }

  isValidBrand(): boolean {
    return !!this.newBrand.name.trim() && !!this.newBrand.description.trim();
  }

  createBrand() {
    if (!this.isValidBrand()) {
      alert('Por favor completa al menos el nombre y descripción de la marca');
      return;
    }

    this.sellerService.createMyBrand(this.newBrand).subscribe({
      next: (createdBrand) => {
        console.log('✅ Brand created successfully:', createdBrand);
        this.closeCreateModal();
        this.loadBrands(); // Recargar la lista
        alert('Marca creada exitosamente!');
      },
      error: (error) => {
        console.error('❌ Error creating brand:', error);
        alert('Error creando la marca: ' + error.message);
      }
    });
  }

  deleteBrand(brandId: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta marca? Esta acción no se puede deshacer.')) {
      console.log('Delete brand:', brandId);
      alert('Funcionalidad de eliminar marca pendiente de implementar');
    }
  }

  viewBrandPerfumes(brand: Brand) {
    console.log('View perfumes for brand:', brand.name);
    // Aquí puedes implementar filtrado por marca si lo deseas
    alert(`Mostrando perfumes de ${brand.name}`);
  }

  // 🔥 BRANDS IMAGES
  getBrandImage(brand: Brand): string {
    if (brand.imageUrl) {
      return brand.imageUrl;
    }
    return 'assets/images/default-brand.jpg';
  }

  onBrandImageError(brand: Brand) {
    console.warn('🖼️ Image failed to load for brand:', brand.name);
    brand.imageUrl = 'assets/images/default-brand.jpg';
  }

  onBrandImageLoad(brand: Brand) {
    console.log('✅ Brand image loaded successfully for:', brand.name);
  }

  // 🔥 EXISTING PERFUMES METHODS
  loadPerfumes() {
    this.isLoading = true;
    this.sellerService.getMyPerfumes(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('✅ Perfumes loaded successfully');
      },
      error: (error) => {
        console.error('❌ Error loading perfumes:', error);
        this.isLoading = false;
      }
    });
  }

  openAddProductStepper() {
    this.stepperService.openStepper();
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
        this.loadPerfumes();
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
          this.loadPerfumes();
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
    if (perfume.imageUrl) {
      return perfume.imageUrl;
    }
    return 'assets/images/default-perfume.jpg';
  }

  // Método para manejar error de imagen
  onImageError(perfume: Perfume) {
    console.warn('🖼️ Image failed to load for perfume:', perfume.name);
    perfume.imageUrl = 'assets/images/default-perfume.jpg';
  }

  // Método para cuando la imagen carga correctamente
  onImageLoad(perfume: Perfume) {
    console.log('✅ Image loaded successfully for:', perfume.name);
  }

  // Método para ver detalles del perfume
  viewPerfumeDetails(perfume: Perfume) {
    console.log('👁️ Viewing details:', perfume);
  }

  // 🔥 PERFUMES STATISTICS
  getTotalStock(): number {
    return this.perfumes.reduce((total, perfume) => total + (perfume.stock || 0), 0);
  }

  getUniqueBrands(): number {
    const brandNames = new Set(
      this.perfumes
        .map(p => p.brand?.name || p.brandName)
        .filter(name => name && name !== 'Sin marca')
    );
    return brandNames.size;
  }

  getLowStockCount(): number {
    return this.perfumes.filter(p => (p.stock || 0) < 10).length;
  }
}