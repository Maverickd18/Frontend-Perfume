import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError, map } from 'rxjs';
import { AuthService } from './auth.service';

const API_URL = 'http://localhost:8080/api';

export interface Perfume {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  sizeMl: number;
  genre?: string;
  releaseDate?: string;
  brandId?: number;
  categoryId?: number;
  imageUrl?: string | null;
  brand?: {
    id: number;
    name: string;
    description: string;
    countryOrigin?: string;
    imageUrl?: string | null;
  };
  category?: {
    id: number;
    name: string;
    description: string;
  };
}

export interface Brand {
  id?: number;
  name: string;
  description: string;
  countryOrigin?: string | null;  // Change this line
  imageUrl?: string | null;
  creador?: string;
  totalPerfumes?: number;
  perfumes?: Perfume[];
}

export interface Category {
  id?: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private perfumesSubject = new BehaviorSubject<Perfume[]>([]);
  public perfumes$ = this.perfumesSubject.asObservable();

  private brands: Brand[] = [];
  private categories: Category[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { 
    this.perfumesSubject.next([]);
  }

  // Headers con token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    
    if (!token) {
      console.warn('No authentication token found');
      throw new Error('No authentication token available');
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    console.error('HTTP Error:', error);
    
    if (error.status === 403) {
      return throwError(() => new Error('Access forbidden. Please check your permissions.'));
    } else if (error.status === 401) {
      return throwError(() => new Error('Unauthorized. Please login again.'));
    } else if (error.status === 0) {
      return throwError(() => new Error('Network error. Please check your connection.'));
    } else {
      return throwError(() => new Error(error.message || 'An error occurred. Please try again.'));
    }
  }

  // Verificar permisos
  private checkPermissions(): void {
    if (!this.authService.isAuthenticated()) {
      throw new Error('User not authenticated');
    }
    
    if (!this.authService.isSeller() && !this.authService.isAdmin()) {
      throw new Error('User does not have seller permissions');
    }
  }

  // ============= MARCAS DEL USUARIO =============
  getMyBrands(): Observable<Brand[]> {
    try {
      this.checkPermissions();
      const headers = this.getHeaders();
      
      return this.http.get<Brand[]>(`${API_URL}/brands/mis-marcas`, { headers })
        .pipe(
          tap(brands => {
            this.brands = Array.isArray(brands) ? brands : [];
            console.log('My brands loaded:', this.brands);
          }),
          catchError(this.handleError)
        );
    } catch (error: any) {
      return throwError(() => error);
    }
  }

  createMyBrand(brand: Omit<Brand, 'id'>): Observable<Brand> {
  try {
    this.checkPermissions();
    const headers = this.getHeaders();
    
    return this.http.post<any>(`${API_URL}/brands/mis-marcas`, brand, { headers })
      .pipe(
        map(response => {
          // Extraer la marca del objeto de respuesta
          const brandData = response.data || response;
          return brandData;
        }),
        tap(newBrand => {
          this.brands = [...(Array.isArray(this.brands) ? this.brands : []), newBrand];
        }),
        catchError(this.handleError)
      );
  } catch (error: any) {
    return throwError(() => error);
  }
}

  createMyBrandWithImage(brand: Omit<Brand, 'id'>, image: File): Observable<Brand> {
    try {
      this.checkPermissions();
      const formData = new FormData();
      formData.append('brand', new Blob([JSON.stringify(brand)], { type: 'application/json' }));
      formData.append('imagen', image);

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      });

      return this.http.post<Brand>(`${API_URL}/brands/mis-marcas/con-imagen`, formData, { headers })
        .pipe(
          tap(newBrand => {
            this.brands = [...(Array.isArray(this.brands) ? this.brands : []), newBrand];
            console.log('My brand with image created:', newBrand);
          }),
          catchError(this.handleError)
        );
    } catch (error: any) {
      return throwError(() => error);
    }
  }

  // ============= CATEGORÍAS =============
  getCategories(): Observable<Category[]> {
    try {
      this.checkPermissions();
      const headers = this.getHeaders();
      
      return this.http.get<Category[]>(`${API_URL}/categories`, { headers })
        .pipe(
          tap(categories => {
            this.categories = Array.isArray(categories) ? categories : [];
            console.log('Categories loaded:', this.categories);
          }),
          catchError(this.handleError)
        );
    } catch (error: any) {
      return throwError(() => error);
    }
  }

  createCategory(category: Omit<Category, 'id'>): Observable<Category> {
    try {
      this.checkPermissions();
      const headers = this.getHeaders();
      
      return this.http.post<Category>(`${API_URL}/categories`, category, { headers })
        .pipe(
          tap(newCategory => {
            this.categories = [...(Array.isArray(this.categories) ? this.categories : []), newCategory];
            console.log('Category created:', newCategory);
          }),
          catchError(this.handleError)
        );
    } catch (error: any) {
      return throwError(() => error);
    }
  }

  // ============= PERFUMES DEL USUARIO =============
  getMyPerfumes(page: number = 0, size: number = 50, filtro: string = ''): Observable<any> {
    try {
      this.checkPermissions();
      const headers = this.getHeaders();
      
      const params = `?page=${page}&size=${size}${filtro ? `&filtro=${filtro}` : ''}`;
      return this.http.get<any>(`${API_URL}/perfumes/mis-perfumes${params}`, { headers })
        .pipe(
          tap(response => {
            console.log('My perfumes loaded:', response);
            if (response.data && Array.isArray(response.data)) {
              this.perfumesSubject.next(response.data);
            }
          }),
          catchError(this.handleError)
        );
    } catch (error: any) {
      return throwError(() => error);
    }
  }

  createPerfume(perfume: Omit<Perfume, 'id'>): Observable<Perfume> {
    try {
      this.checkPermissions();
      const headers = this.getHeaders();
      
      console.log('Creating perfume with data:', perfume);
      
      return this.http.post<Perfume>(`${API_URL}/perfumes/nuevo`, perfume, { headers })
        .pipe(
          tap(newPerfume => {
            console.log('Perfume created successfully:', newPerfume);
            const currentPerfumes = this.perfumesSubject.getValue();
            this.perfumesSubject.next([...currentPerfumes, newPerfume]);
          }),
          catchError(this.handleError)
        );
    } catch (error: any) {
      return throwError(() => error);
    }
  }

  updatePerfume(id: number, perfume: Partial<Perfume>): Observable<Perfume> {
    try {
      this.checkPermissions();
      const headers = this.getHeaders();
      
      return this.http.put<Perfume>(`${API_URL}/perfumes/${id}`, perfume, { headers })
        .pipe(
          tap(updatedPerfume => {
            const currentPerfumes = this.perfumesSubject.getValue();
            const index = currentPerfumes.findIndex(p => p.id === id);
            
            if (index !== -1) {
              currentPerfumes[index] = { ...currentPerfumes[index], ...updatedPerfume };
              this.perfumesSubject.next([...currentPerfumes]);
            }
          }),
          catchError(this.handleError)
        );
    } catch (error: any) {
      return throwError(() => error);
    }
  }

  deletePerfume(id: number): Observable<void> {
    try {
      this.checkPermissions();
      const headers = this.getHeaders();
      
      return this.http.delete<void>(`${API_URL}/perfumes/${id}`, { headers })
        .pipe(
          tap(() => {
            const currentPerfumes = this.perfumesSubject.getValue();
            this.perfumesSubject.next(currentPerfumes.filter(p => p.id !== id));
          }),
          catchError(this.handleError)
        );
    } catch (error: any) {
      return throwError(() => error);
    }
  }

  // ============= SUBIDA DE IMÁGENES =============
  uploadPerfumeImage(image: File): Observable<any> {
    try {
      this.checkPermissions();
      const formData = new FormData();
      formData.append('file', image);

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      });

      return this.http.post<any>(`${API_URL}/upload/image`, formData, { headers })
        .pipe(
          tap(response => {
            console.log('Image uploaded successfully:', response);
          }),
          catchError(this.handleError)
        );
    } catch (error: any) {
      return throwError(() => error);
    }
  }

  // ============= MÉTODOS AUXILIARES =============
  getBrandsList(): Brand[] {
    return Array.isArray(this.brands) ? this.brands : [];
  }

  getCategoriesList(): Category[] {
    return Array.isArray(this.categories) ? this.categories : [];
  }

  canCreatePerfume(): boolean {
    return this.authService.isSeller() || this.authService.isAdmin();
  }

  // Cargar datos iniciales
  initializeData(): void {
    if (this.canCreatePerfume()) {
      this.getMyBrands().subscribe({
        error: (error) => console.error('Error loading my brands:', error)
      });
      this.getCategories().subscribe({
        error: (error) => console.error('Error loading categories:', error)
      });
      this.getMyPerfumes().subscribe({
        error: (error) => console.error('Error loading my perfumes:', error)
      });
    }
  }
}