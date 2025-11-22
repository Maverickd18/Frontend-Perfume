import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl + '/api';

export interface Perfume {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  sizeMl: number;
  genre: string;
  releaseDate: string;
  imageUrl?: string;
  brandName?: string;
  categoryName?: string;
}

export interface Brand {
  id: number;
  name: string;
  description: string;
  countryOrigin?: string;
  imageUrl?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  // ========== PERFUMES PÚBLICOS ==========
  
  getProducts(page: number = 0, size: number = 20, filtro?: string): Observable<Perfume[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filtro) {
      params = params.set('filtro', filtro);
    }

    return this.http.get<any>(`${API_URL}/perfumes`, { params })
      .pipe(
        map(response => {
          console.log('API Response:', response);
          if (response && response.data) {
            return response.data.map((perfume: any) => this.mapPerfumeToFrontend(perfume));
          }
          return [];
        }),
        catchError(this.handleError)
      );
  }

  getProductById(id: number): Observable<Perfume> {
    return this.http.get<any>(`${API_URL}/perfumes/public/${id}`)
      .pipe(
        map(response => {
          if (response && response.data) {
            return this.mapPerfumeToFrontend(response.data);
          }
          throw new Error('Product not found');
        }),
        catchError(this.handleError)
      );
  }

  // ========== MARCAS PÚBLICAS ==========
  
  getBrands(): Observable<Brand[]> {
    return this.http.get<any>(`${API_URL}/brands/public`)
      .pipe(
        map(response => response?.data || []),
        catchError(this.handleError)
      );
  }

  getBrandById(id: number): Observable<Brand> {
    return this.http.get<any>(`${API_URL}/brands/public/${id}`)
      .pipe(
        map(response => response?.data),
        catchError(this.handleError)
      );
  }

  getBrandPerfumes(brandId: number): Observable<Perfume[]> {
    return this.http.get<any>(`${API_URL}/brands/public/${brandId}/perfumes`)
      .pipe(
        map(response => {
          if (response && response.data) {
            return response.data.map((perfume: any) => this.mapPerfumeToFrontend(perfume));
          }
          return [];
        }),
        catchError(this.handleError)
      );
  }

  // ========== CATEGORÍAS PÚBLICAS ==========
  
  getCategories(): Observable<Category[]> {
    return this.http.get<any>(`${API_URL}/categories/public`)
      .pipe(
        map(response => response?.data || []),
        catchError(this.handleError)
      );
  }

  // ========== BÚSQUEDA AVANZADA ==========
  
  searchProducts(query: string): Observable<Perfume[]> {
    return this.getProducts(0, 50, query);
  }

  // ========== MANEJO DE ERRORES ==========
  
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      if (error.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      } else {
        errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }

  // ========== MÉTODO PARA MAPEAR DATOS ==========
  
  private mapPerfumeToFrontend(backendPerfume: any): Perfume {
    return {
      id: backendPerfume.id,
      name: backendPerfume.name,
      description: backendPerfume.description,
      price: backendPerfume.price,
      stock: backendPerfume.stock,
      sizeMl: backendPerfume.sizeMl,
      genre: backendPerfume.genre,
      releaseDate: backendPerfume.releaseDate,
      imageUrl: backendPerfume.imageUrl,
      brandName: backendPerfume.brandName || backendPerfume.brand?.name,
      categoryName: backendPerfume.categoryName || backendPerfume.category?.name
    };
  }
}