import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  constructor(private navCtrl: NavController) {}

  allProducts = [
    {
      id: 1,
      title: 'Soft Rose',
      description: 'Aromatic floral with soft musk notes.',
      image: 'https://ionicframework.com/docs/img/demos/card-media.png',
      price: 29.99,
      size: '100ml',
      brand: 'LuxeCo',
      category: 'floral',
      stock: 15
    },
    {
      id: 2,
      title: 'Amber Night',
      description: 'Warm, amber and vanilla tones for evening wear.',
      image: 'https://ionicframework.com/docs/img/demos/card-media.png',
      price: 39.99,
      size: '50ml',
      brand: 'NoirScent',
      category: 'oriental',
      stock: 8
    },
    {
      id: 3,
      title: 'Citrus Fresh',
      description: 'Bright citrus with green top notes, perfect for daytime.',
      image: 'https://ionicframework.com/docs/img/demos/card-media.png',
      price: 24.99,
      size: '75ml',
      brand: 'FreshAura',
      category: 'citrus',
      stock: 20
    },
    {
      id: 4,
      title: 'Midnight Bloom',
      description: 'Deep floral essence with exotic undertones.',
      image: 'https://ionicframework.com/docs/img/demos/card-media.png',
      price: 44.99,
      size: '100ml',
      brand: 'LuxeCo',
      category: 'floral',
      stock: 12
    },
    {
      id: 5,
      title: 'Ocean Breeze',
      description: 'Fresh and aquatic notes perfect for summer.',
      image: 'https://ionicframework.com/docs/img/demos/card-media.png',
      price: 32.99,
      size: '75ml',
      brand: 'FreshAura',
      category: 'citrus',
      stock: 18
    },
    {
      id: 6,
      title: 'Velvet Spice',
      description: 'Luxurious warm spices with woody base.',
      image: 'https://ionicframework.com/docs/img/demos/card-media.png',
      price: 49.99,
      size: '50ml',
      brand: 'NoirScent',
      category: 'oriental',
      stock: 10
    },
    {
      id: 7,
      title: 'Garden Petals',
      description: 'Soft blend of iris and peony flowers.',
      image: 'https://ionicframework.com/docs/img/demos/card-media.png',
      price: 27.99,
      size: '100ml',
      brand: 'LuxeCo',
      category: 'floral',
      stock: 25
    },
    {
      id: 8,
      title: 'Lemon Zest',
      description: 'Energetic citrus burst with bergamot.',
      image: 'https://ionicframework.com/docs/img/demos/card-media.png',
      price: 21.99,
      size: '75ml',
      brand: 'FreshAura',
      category: 'citrus',
      stock: 30
    },
    {
      id: 9,
      title: 'Oud Heritage',
      description: 'Premium oud blended with rose and sandalwood.',
      image: 'https://ionicframework.com/docs/img/demos/card-media.png',
      price: 64.99,
      size: '50ml',
      brand: 'NoirScent',
      category: 'oriental',
      stock: 6
    },
    {
      id: 10,
      title: 'Cherry Blossom',
      description: 'Sweet floral with light fruity notes.',
      image: 'https://ionicframework.com/docs/img/demos/card-media.png',
      price: 31.99,
      size: '100ml',
      brand: 'LuxeCo',
      category: 'floral',
      stock: 16
    },
    {
      id: 11,
      title: 'Tropical Storm',
      description: 'Exotic mix of mango, pineapple and coconut.',
      image: 'https://ionicframework.com/docs/img/demos/card-media.png',
      price: 28.99,
      size: '75ml',
      brand: 'FreshAura',
      category: 'citrus',
      stock: 22
    }
  ];

  products = [...this.allProducts];

  showFilters: boolean = false;
  filterCategory: string[] = [];
  filterBrand: string[] = [];
  filterSize: string[] = [];
  filterPriceRange: number[] = [0, 100];

  get brands(): string[] {
    const set = new Set<string>();
    this.allProducts.forEach((p: any) => p.brand && set.add(p.brand));
    return Array.from(set);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  onFilterChange() {
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

  logout() {
    alert('Sesión cerrada');
    this.navCtrl.navigateRoot('/login');
  }

  goHome() {
    this.navCtrl.navigateRoot('/home');
  }

  onView(p: any) {
    alert('Ver producto: ' + p.title);
  }

  onBuy(p: any) {
    alert('Comprar producto: ' + p.title + '\nPrecio: $' + p.price);
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
}
