import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:3001/api';
  private products$ = new BehaviorSubject<any[]>([]);

  constructor() {
    this.initializeProducts();
  }

  getProducts(): Observable<any[]> {
    return new Observable(observer => {
      observer.next(this.products$.value);
      observer.complete();
    });
  }

  getProductById(id: number): Observable<any> {
    return new Observable(observer => {
      const product = this.products$.value.find(p => p.id === id);
      observer.next(product);
      observer.complete();
    });
  }

  searchProducts(query: string): Observable<any[]> {
    return new Observable(observer => {
      const lowerQuery = query.toLowerCase();
      const filtered = this.products$.value.filter(p =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
      );
      observer.next(filtered);
      observer.complete();
    });
  }

  filterProducts(filters: any): Observable<any[]> {
    return new Observable(observer => {
      let filtered = [...this.products$.value];

      if (filters.category && filters.category.length > 0) {
        filtered = filtered.filter(p => filters.category.includes(p.category));
      }

      if (filters.brand && filters.brand.length > 0) {
        filtered = filtered.filter(p => filters.brand.includes(p.brand));
      }

      if (filters.size && filters.size.length > 0) {
        filtered = filtered.filter(p => filters.size.includes(p.size));
      }

      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        filtered = filtered.filter(p => p.price >= min && p.price <= max);
      }

      observer.next(filtered);
      observer.complete();
    });
  }

  createProduct(product: any): Observable<any> {
    return new Observable(observer => {
      observer.next({ success: true, id: Math.random() });
      observer.complete();
    });
  }

  updateProduct(id: number, product: any): Observable<any> {
    return new Observable(observer => {
      observer.next({ success: true, id: id });
      observer.complete();
    });
  }

  deleteProduct(id: number): Observable<any> {
    return new Observable(observer => {
      observer.next({ success: true });
      observer.complete();
    });
  }

  private initializeProducts(): void {
    const products = [
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

    this.products$.next(products);
  }
}
