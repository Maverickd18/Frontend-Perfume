import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProductService, Perfume, Brand, Category } from '../services/product.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  allProducts: Perfume[] = [];
  products: Perfume[] = [];
  brands: Brand[] = [];
  categories: Category[] = [];
  
  showFilters: boolean = false;
  filterCategory: string[] = [];
  filterBrand: string[] = [];
  filterSize: string[] = [];
  filterPriceRange: number[] = [0, 500];

  isLoading = false;
  searchQuery: string = '';
  errorMessage: string = '';

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    await this.loadInitialData();
  }

  async loadInitialData() {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      console.log('Cargando datos iniciales...');
      
      // Cargar productos
      const products = await this.productService.getProducts().toPromise();
      this.allProducts = products || [];
      this.products = [...this.allProducts];
      console.log('Productos cargados:', this.allProducts.length);

      // Cargar marcas para filtros
      const brands = await this.productService.getBrands().toPromise();
      this.brands = brands || [];
      console.log('Marcas cargadas:', this.brands.length);

      // Cargar categorías para filtros
      const categories = await this.productService.getCategories().toPromise();
      this.categories = categories || [];
      console.log('Categorías cargadas:', this.categories.length);

    } catch (error: any) {
      console.error('Error loading initial data:', error);
      this.errorMessage = error.message || 'Error al cargar los datos';
      this.showErrorAlert(this.errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  // ========== MÉTODOS DE BÚSQUEDA ==========

  onSearchChange(event: any) {
    const query = event.detail.value?.toLowerCase().trim() || '';
    this.searchQuery = query;
    this.applyFilters();
  }

  // ========== MÉTODOS DE FILTROS ==========

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  onFilterChange() {
    // Este método se llama cuando cambian los sliders de precio
    this.applyFilters();
  }

  toggleFilterCategory(categoryName: string) {
    const index = this.filterCategory.indexOf(categoryName);
    if (index > -1) {
      this.filterCategory.splice(index, 1);
    } else {
      this.filterCategory.push(categoryName);
    }
  }

  toggleFilterBrand(brandName: string) {
    const index = this.filterBrand.indexOf(brandName);
    if (index > -1) {
      this.filterBrand.splice(index, 1);
    } else {
      this.filterBrand.push(brandName);
    }
  }

  toggleFilterSize(size: string) {
    const index = this.filterSize.indexOf(size);
    if (index > -1) {
      this.filterSize.splice(index, 1);
    } else {
      this.filterSize.push(size);
    }
  }

  clearFilters() {
    this.filterCategory = [];
    this.filterBrand = [];
    this.filterSize = [];
    this.filterPriceRange = [0, 500];
    this.searchQuery = '';
    this.products = [...this.allProducts];
    this.showFilters = false;
  }

  applyFilters() {
    const text = this.searchQuery.toLowerCase().trim();
    const categories = this.filterCategory;
    const sizes = this.filterSize;
    const brands = this.filterBrand;
    const priceRange = this.filterPriceRange;
    const min = priceRange[0] ?? 0;
    const max = priceRange[1] ?? 500;

    this.products = this.allProducts.filter((p: Perfume) => {
      const matchesText = !text || 
        (p.name + ' ' + p.description + ' ' + p.brandName).toLowerCase().includes(text);
      
      const matchesCategory = categories.length === 0 || 
        (p.categoryName && categories.includes(p.categoryName));
      
      const matchesSize = sizes.length === 0 || 
        sizes.includes(p.sizeMl + 'ml');
      
      const matchesBrand = brands.length === 0 || 
        (p.brandName && brands.includes(p.brandName));
      
      const matchesPrice = (p.price ?? 0) >= min && (p.price ?? 0) <= max;
      
      return matchesText && matchesCategory && matchesSize && matchesBrand && matchesPrice;
    });

    this.showFilters = false;
  }

  // ========== MÉTODOS DE NAVEGACIÓN ==========

  goProfile() {
    this.navCtrl.navigateForward('/profile-client');
  }

  onCartClick() {
    this.navCtrl.navigateForward('/cart');
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    this.navCtrl.navigateRoot('/login');
  }

  onView(product: Perfume) {
    // Navegar con ID en la ruta y producto en el state
    this.router.navigate(['/product-detail', product.id], {
      state: { product }
    });
  }

  addToCart(product: Perfume) {
    if (product.stock > 0) {
      this.cartService.addToCart(product, 1);
      this.showAddToCartAlert(product.name);
    } else {
      this.showErrorAlert('Este producto no está disponible en stock');
    }
  }

  // ========== MÉTODOS DE ALERTA ==========

  private async showAddToCartAlert(productName: string) {
    const alert = await this.alertCtrl.create({
      header: 'Producto Agregado',
      message: productName + ' ha sido agregado a tu carrito',
      buttons: [
        {
          text: 'Continuar Comprando',
          role: 'cancel'
        },
        {
          text: 'Ir al Carrito',
          handler: () => {
            this.navCtrl.navigateForward('/cart');
          }
        }
      ]
    });
    await alert.present();
  }

  private async showErrorAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // ========== GETTERS PARA FILTROS ==========

  get availableSizes(): string[] {
    const sizes = new Set<string>();
    this.allProducts.forEach(p => {
      sizes.add(p.sizeMl + 'ml');
    });
    return Array.from(sizes).sort((a, b) => {
      const sizeA = parseInt(a.replace('ml', ''));
      const sizeB = parseInt(b.replace('ml', ''));
      return sizeA - sizeB;
    });
  }

  get availableBrands(): string[] {
    const brands = new Set<string>();
    this.allProducts.forEach(p => {
      if (p.brandName) {
        brands.add(p.brandName);
      }
    });
    return Array.from(brands).sort();
  }

  get availableCategories(): string[] {
    const categories = new Set<string>();
    this.allProducts.forEach(p => {
      if (p.categoryName) {
        categories.add(p.categoryName);
      }
    });
    return Array.from(categories).sort();
  }

  // ========== MÉTODOS PARA TEMPLATE ==========

  get filteredProductsCount(): number {
    return this.products.length;
  }

  get totalProductsCount(): number {
    return this.allProducts.length;
  }

  get hasError(): boolean {
    return !!this.errorMessage;
  }
}