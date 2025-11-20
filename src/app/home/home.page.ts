import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  allProducts: any[] = [];
  products: any[] = [];
  showFilters: boolean = false;
  filterCategory: string[] = [];
  filterBrand: string[] = [];
  filterSize: string[] = [];
  filterPriceRange: number[] = [0, 100];

  constructor(
    private navCtrl: NavController,
    private productService: ProductService,
    private cartService: CartService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.addTestProduct();
  }

  private loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.products = [...this.allProducts];
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  private addTestProduct() {
    const testProduct = {
      id: 999,
      title: 'Eau de Parfum Floral',
      description: 'Perfume floral con notas de rosa y jazmín',
      image: 'https://via.placeholder.com/200x200?text=Perfume',
      price: 59.99,
      size: '100ml',
      stock: 15,
      brand: 'Chanel',
      category: 'floral'
    };
    this.allProducts.unshift(testProduct);
    this.products.unshift(testProduct);
  }

  get brands(): string[] {
    const set = new Set<string>();
    this.allProducts.forEach((p: any) => p.brand && set.add(p.brand));
    return Array.from(set);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  onFilterChange() {
    // Empty for now
  }

  toggleFilterCategory(value: string) {
    const index = this.filterCategory.indexOf(value);
    if (index > -1) {
      this.filterCategory.splice(index, 1);
    } else {
      this.filterCategory.push(value);
    }
    this.onFilterChange();
  }

  toggleFilterBrand(value: string) {
    const index = this.filterBrand.indexOf(value);
    if (index > -1) {
      this.filterBrand.splice(index, 1);
    } else {
      this.filterBrand.push(value);
    }
    this.onFilterChange();
  }

  toggleFilterSize(value: string) {
    const index = this.filterSize.indexOf(value);
    if (index > -1) {
      this.filterSize.splice(index, 1);
    } else {
      this.filterSize.push(value);
    }
    this.onFilterChange();
  }

  clearFilters() {
    this.filterCategory = [];
    this.filterBrand = [];
    this.filterSize = [];
    this.filterPriceRange = [0, 100];
    this.onFilterChange();
  }

  applyFilters() {
    this.onFiltersChange({
      text: '',
      category: this.filterCategory,
      brand: this.filterBrand,
      size: this.filterSize,
      priceRange: this.filterPriceRange
    });
    this.showFilters = false;
  }

  goProfile() {
    this.navCtrl.navigateForward('/profile-client');
  }

  onCartClick() {
    this.navCtrl.navigateForward('/cart');
  }

  logout() {
    alert('Sesión cerrada');
    this.navCtrl.navigateRoot('/login');
  }

  goHome() {
    this.navCtrl.navigateRoot('/home');
  }

  onView(p: any) {
    this.navCtrl.navigateForward('/product-detail', {
      state: { product: p }
    });
  }

  onFiltersChange(filters: any) {
    const text = (filters?.text || '').toLowerCase().trim();
    const categories = filters?.category || [];
    const sizes = filters?.size || [];
    const brands = filters?.brand || [];
    const priceRange = filters?.priceRange || [0, Infinity];
    const min = priceRange[0] ?? 0;
    const max = priceRange[1] ?? Infinity;

    this.products = this.allProducts.filter((p: any) => {
      const matchesText = !text || (p.title + ' ' + p.description).toLowerCase().includes(text);
      const matchesCategory = categories.length === 0 || categories.includes(p.category);
      const matchesSize = sizes.length === 0 || sizes.includes(p.size);
      const matchesBrand = brands.length === 0 || brands.includes(p.brand);
      const matchesPrice = (p.price ?? 0) >= min && (p.price ?? 0) <= max;
      return matchesText && matchesCategory && matchesSize && matchesBrand && matchesPrice;
    });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product, 1);
    this.showAddToCartAlert(product.title);
  }

  private async showAddToCartAlert(productName: string) {
    const alert = await this.alertCtrl.create({
      header: 'Producto Agregado',
      message: `${productName} ha sido agregado a tu carrito`,
      buttons: [
        {
          text: 'Continuar Comprando',
          handler: () => {
            // Close alert and stay on page
          }
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
}
