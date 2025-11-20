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
  creador?: string;
  brandName?: string;
  categoryName?: string;
}

export interface Brand {
  id?: number;
  name: string;
  description: string;
  countryOrigin?: string | null;
  imageUrl?: string | null;
  creador?: string;
  totalPerfumes?: number;
  perfumes?: Perfume[];
}

export interface Category {
  id?: number;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
  meta?: any;
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
      
      return this.http.get<ApiResponse<Brand[]>>(`${API_URL}/brands/mis-marcas`, { headers })
        .pipe(
          map(response => {
            const brands = response.data || [];
            this.brands = Array.isArray(brands) ? brands : [];
            console.log('📦 My brands loaded:', this.brands);
            return this.brands;
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
      
      return this.http.post<Brand>(`${API_URL}/brands/mis-marcas`, brand, { headers })
        .pipe(
          map(brandData => {
            this.brands = [...this.brands, brandData];
            console.log('✅ Brand created:', brandData);
            return brandData;
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
            console.log('📦 Categories loaded:', this.categories);
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
          map(categoryData => {
            this.categories = [...this.categories, categoryData];
            console.log('✅ Category created:', categoryData);
            return categoryData;
          }),
          catchError(this.handleError)
        );
    } catch (error: any) {
      return throwError(() => error);
    }
  }

  // ============= PERFUMES DEL USUARIO =============
  getMyPerfumes(page: number = 0, size: number = 50, filtro: string = ''): Observable<ApiResponse<Perfume[]>> {
    try {
      this.checkPermissions();
      const headers = this.getHeaders();
      
      const params = `?page=${page}&size=${size}${filtro ? `&filtro=${filtro}` : ''}`;
      return this.http.get<ApiResponse<Perfume[]>>(`${API_URL}/perfumes/mis-perfumes${params}`, { headers })
        .pipe(
          tap(response => {
            console.log('🔍 DEBUG - Full API Response:', response);
            
            if (response.data && Array.isArray(response.data)) {
              console.log('📦 Number of perfumes:', response.data.length);
              
              response.data.forEach((perfume, index) => {
                console.log(`🎯 Perfume ${index + 1}:`, {
                  id: perfume.id,
                  name: perfume.name,
                  imageUrl: perfume.imageUrl,
                  brand: perfume.brand,
                  category: perfume.category,
                  brandName: perfume.brandName,
                  categoryName: perfume.categoryName
                });
              });
              
              const perfumesWithImages = response.data.map(perfume => ({
                ...perfume,
                imageUrl: this.getFullImageUrl(perfume.imageUrl)
              }));
              
              console.log('🖼️ After image processing:', perfumesWithImages);
              this.perfumesSubject.next(perfumesWithImages);
            } else {
              console.warn('⚠️ No data in response or data is not an array');
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
    
    console.log('🔄 Creating perfume with data:', perfume);
    
    return this.http.post<Perfume>(`${API_URL}/perfumes/nuevo`, perfume, { headers })
      .pipe(
        map(perfumeData => {
          console.log('✅ Perfume created successfully:', perfumeData);
          
          // Actualizar la lista local - FORZAR recarga completa
          this.loadPerfumesAfterCreate();
          
          return perfumeData;
        }),
        catchError(error => {
          console.error('❌ Error in createPerfume:', error);
          console.error('Error details:', error.error);
          return this.handleError(error);
        })
      );
  } catch (error: any) {
    console.error('❌ Error in createPerfume:', error);
    return throwError(() => error);
  }
}

// Método auxiliar para recargar perfumes después de crear uno nuevo
private loadPerfumesAfterCreate() {
  this.getMyPerfumes(0, 50, '').subscribe({
    next: (response) => {
      console.log('🔄 Perfumes reloaded after creation');
    },
    error: (error) => {
      console.error('❌ Error reloading perfumes:', error);
    }
  });
}
  updatePerfume(id: number, perfume: Partial<Perfume>): Observable<Perfume> {
    try {
      this.checkPermissions();
      const headers = this.getHeaders();
      
      return this.http.put<Perfume>(`${API_URL}/perfumes/${id}`, perfume, { headers })
        .pipe(
          map(updatedPerfume => {
            const currentPerfumes = this.perfumesSubject.getValue();
            const index = currentPerfumes.findIndex(p => p.id === id);
            
            if (index !== -1) {
              currentPerfumes[index] = { 
                ...currentPerfumes[index], 
                ...updatedPerfume,
                imageUrl: this.getFullImageUrl(updatedPerfume.imageUrl)
              };
              this.perfumesSubject.next([...currentPerfumes]);
            }
            
            return updatedPerfume;
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

      // IMPORTANTE: No establecer Content-Type para FormData
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
        // El navegador establecerá automáticamente: 'Content-Type': 'multipart/form-data; boundary=...'
      });

      console.log('📤 Uploading image:', {
        name: image.name,
        size: image.size,
        type: image.type
      });

      return this.http.post<any>(`${API_URL}/upload/image`, formData, { headers })
        .pipe(
          tap(response => {
            console.log('✅ Upload response received:', response);
            // Verificar que tenemos fileUrl
            if (!response.fileUrl) {
              console.warn('⚠️ No fileUrl in response:', response);
            }
          }),
          catchError(this.handleError)
        );
    } catch (error: any) {
      console.error('❌ Error in uploadPerfumeImage:', error);
      return throwError(() => error);
    }
  }

  private getFullImageUrl(imageUrl: string | null | undefined): string | null {
  console.log('🖼️ Processing image URL:', imageUrl);
  
  if (!imageUrl) {
    console.log('ℹ️ No image URL, returning null');
    return null; // Devolver null en lugar de imagen por defecto
  }
  
  // Si ya es una URL completa (http o https)
  if (imageUrl.startsWith('http')) {
    console.log('🔗 Already full URL:', imageUrl);
    return imageUrl;
  }
  
  // Si es una ruta relativa del servidor
  if (imageUrl.startsWith('/uploads/')) {
    const fullUrl = `http://localhost:8080${imageUrl}`;
    console.log('🔗 Converted relative to full URL:', fullUrl);
    return fullUrl;
  }
  
  // Si es solo el nombre del archivo
  const fullUrl = `http://localhost:8080/uploads/${imageUrl}`;
  console.log('🔗 Built URL from filename:', fullUrl);
  return fullUrl;
}
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