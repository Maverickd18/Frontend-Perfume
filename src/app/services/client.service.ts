import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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
export class ClientService {

  constructor(private http: HttpClient) { }

  // ========== PERFUMES PÚBLICOS ==========
  
  getPerfumes(page: number = 0, size: number = 20, filtro?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filtro) {
      params = params.set('filtro', filtro);
    }

    return this.http.get<any>(`${API_URL}/perfumes`, { params });
  }

  getPerfumeById(id: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/perfumes/public/${id}`);
  }

  // ========== MARCAS PÚBLICAS ==========
  
  getBrands(): Observable<any> {
    return this.http.get<any>(`${API_URL}/brands/public`);
  }

  getBrandById(id: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/brands/public/${id}`);
  }

  getBrandPerfumes(brandId: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/brands/public/${brandId}/perfumes`);
  }

  // ========== CATEGORÍAS PÚBLICAS ==========
  
  getCategories(): Observable<any> {
    return this.http.get<any>(`${API_URL}/categories/public`);
  }

  getCategoryById(id: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/categories/public/${id}`);
  }

  // ========== BÚSQUEDA AVANZADA ==========
  
  searchPerfumes(query: string): Observable<any> {
    return this.http.get<any>(`${API_URL}/perfumes?filtro=${query}`);
  }

  getPerfumesByCategory(categoryId: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/categories/public/${categoryId}/perfumes`);
  }

  getPerfumesByGenre(genre: string): Observable<any> {
    return this.http.get<any>(`${API_URL}/perfumes?genero=${genre}`);
  }

  // ========== FILTROS COMBINADOS ==========
  
  getFilteredPerfumes(filters: any): Observable<any> {
    let params = new HttpParams();
    
    if (filters.category) {
      params = params.set('categoria', filters.category);
    }
    if (filters.brand) {
      params = params.set('marca', filters.brand);
    }
    if (filters.genre) {
      params = params.set('genero', filters.genre);
    }
    if (filters.minPrice) {
      params = params.set('precioMin', filters.minPrice.toString());
    }
    if (filters.maxPrice) {
      params = params.set('precioMax', filters.maxPrice.toString());
    }

    return this.http.get<any>(`${API_URL}/perfumes`, { params });
  }
}