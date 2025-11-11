import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
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
  brand?: {
    id: number;
    name: string;
    description: string;
    countryOrigin?: string;
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
  countryOrigin?: string;
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
  // Inicializar explícitamente con array vacío
  private perfumesSubject = new BehaviorSubject<Perfume[]>([]);
  public perfumes$ = this.perfumesSubject.asObservable();

  private brands: Brand[] = [];
  private categories: Category[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { 
    // Inicializar el BehaviorSubject con array vacío
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

  // ============= MARCAS =============
  getBrands(): Observable<Brand[]> {
    try {
      this.checkPermissions();
      const headers = this.getHeaders();
      
      return this.http.get<Brand[]>(`${API_URL}/brands`, { headers })
        .pipe(
          tap(brands => {
            this.brands = brands || [];
            console.log('Brands loaded:', brands);
          }),
          catchError(this.handleError)
        );
    } catch (error: any) {
      return throwError(() => error);
    }
  }

  createBrand(brand: Omit<Brand, 'id'>): Observable<Brand> {
    try {
      this.checkPermissions();
      const headers = this.getHeaders();
      
      return this.http.post<Brand>(`${API_URL}/brands`, brand, { headers })
        .pipe(
          tap(newBrand => {
            this.brands = [...(this.brands || []), newBrand];
            console.log('Brand created:', newBrand);
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
            this.categories = categories || [];
            console.log('Categories loaded:', categories);
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
            this.categories = [...(this.categories || []), newCategory];
            console.log('Category created:', newCategory);
          }),
          catchError(this.handleError)
        );
    } catch (error: any) {
      return throwError(() => error);
    }
  }

  // ============= PERFUMES =============
  getPerfumes(): Observable<Perfume[]> {
    try {
      this.checkPermissions();
      const headers = this.getHeaders();
      
      return this.http.get<Perfume[]>(`${API_URL}/perfumes`, { headers })
        .pipe(
          tap(perfumes => {
            // Asegurar que siempre sea un array
            const safePerfumes = Array.isArray(perfumes) ? perfumes : [];
            this.perfumesSubject.next(safePerfumes);
            console.log('Perfumes loaded:', safePerfumes);
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
            console.log('Perfume created successfully in backend:', newPerfume);
            
            // Obtener el valor actual de manera segura
            const currentValue = this.perfumesSubject.getValue();
            const currentPerfumes = Array.isArray(currentValue) ? currentValue : [];
            
            // Agregar el nuevo perfume
            const updatedPerfumes = [...currentPerfumes, newPerfume];
            this.perfumesSubject.next(updatedPerfumes);
            
            console.log('Updated perfumes list:', updatedPerfumes);
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
            const currentValue = this.perfumesSubject.getValue();
            const currentPerfumes = Array.isArray(currentValue) ? currentValue : [];
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
            const currentValue = this.perfumesSubject.getValue();
            const currentPerfumes = Array.isArray(currentValue) ? currentValue : [];
            this.perfumesSubject.next(currentPerfumes.filter(p => p.id !== id));
          }),
          catchError(this.handleError)
        );
    } catch (error: any) {
      return throwError(() => error);
    }
  }

  // ============= MÉTODOS AUXILIARES =============
  getBrandsList(): Brand[] {
    return this.brands || [];
  }

  getCategoriesList(): Category[] {
    return this.categories || [];
  }

  canCreatePerfume(): boolean {
    return this.authService.isSeller() || this.authService.isAdmin();
  }

  // Cargar datos iniciales
  initializeData(): void {
    if (this.canCreatePerfume()) {
      this.getBrands().subscribe({
        error: (error) => console.error('Error loading brands:', error)
      });
      this.getCategories().subscribe({
        error: (error) => console.error('Error loading categories:', error)
      });
      this.getPerfumes().subscribe({
        error: (error) => console.error('Error loading perfumes:', error)
      });
    }
  }

  // Método para resetear el estado si es necesario
  resetPerfumes(): void {
    this.perfumesSubject.next([]);
  }
}