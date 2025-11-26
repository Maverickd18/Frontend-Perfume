import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError, of } from 'rxjs';
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
          console.log('Perfumes API Response:', response);
          if (response && response.status === 'success' && response.data) {
            return response.data.map((perfume: any) => this.mapPerfumeToFrontend(perfume));
          }
          console.warn('Unexpected response format for perfumes:', response);
          return [];
        }),
        catchError(this.handleError)
      );
  }

  getProductById(id: number): Observable<Perfume> {
    return this.http.get<any>(`${API_URL}/perfumes/public/${id}`)
      .pipe(
        map(response => {
          console.log('Product by ID API Response:', response);
          if (response && response.status === 'success' && response.data) {
            return this.mapPerfumeToFrontend(response.data);
          }
          throw new Error('Product not found');
        }),
        catchError(this.handleError)
      );
  }

  // ========== MARCAS PÚBLICAS ==========
  
  getBrands(): Observable<Brand[]> {
    return this.http.get(`${API_URL}/brands/public`, { responseType: 'text' })
      .pipe(
        map(responseText => {
          console.log('Raw Brands API Response:', responseText);
          
          try {
            // Si la respuesta es un string que contiene JSON, parsearlo
            let parsedResponse;
            
            // Verificar si ya es un objeto (caso improbable pero por seguridad)
            if (typeof responseText === 'object') {
              parsedResponse = responseText;
            } else {
              // Parsear el string como JSON
              parsedResponse = JSON.parse(responseText);
            }
            
            console.log('Parsed Brands Response:', parsedResponse);
            
            // Extraer los datos según diferentes posibles estructuras
            if (parsedResponse && parsedResponse.status === 'success' && parsedResponse.data) {
              return parsedResponse.data;
            } else if (Array.isArray(parsedResponse)) {
              return parsedResponse; // Si la respuesta es directamente un array
            } else if (parsedResponse.data && Array.isArray(parsedResponse.data)) {
              return parsedResponse.data; // Si está en propiedad data
            } else if (parsedResponse.brands && Array.isArray(parsedResponse.brands)) {
              return parsedResponse.brands; // Si está en propiedad brands
            }
            
            console.warn('Unexpected response format for brands:', parsedResponse);
            return [];
            
          } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('Raw response that failed to parse:', responseText);
            
            // Intentar extraer JSON del string si hay contenido alrededor
            const jsonMatch = responseText.match(/\{.*\}/s) || responseText.match(/\[.*\]/s);
            if (jsonMatch) {
              try {
                const extractedJson = JSON.parse(jsonMatch[0]);
                console.log('Extracted JSON from string:', extractedJson);
                
                if (Array.isArray(extractedJson)) {
                  return extractedJson;
                } else if (extractedJson.data && Array.isArray(extractedJson.data)) {
                  return extractedJson.data;
                } else if (extractedJson.status === 'success' && Array.isArray(extractedJson.data)) {
                  return extractedJson.data;
                }
              } catch (extractError) {
                console.error('Failed to extract JSON from string:', extractError);
              }
            }
            
            // Si todo falla, retornar array vacío
            return [];
          }
        }),
        catchError(error => {
          console.error('Brands API Error:', error);
          // En caso de error, retornar array vacío para que la app no se rompa
          return of([]);
        })
      );
  }

  getBrandById(id: number): Observable<Brand> {
    return this.http.get<any>(`${API_URL}/brands/public/${id}`)
      .pipe(
        map(response => {
          if (response && response.status === 'success' && response.data) {
            return response.data;
          }
          throw new Error('Brand not found');
        }),
        catchError(this.handleError)
      );
  }

  getBrandPerfumes(brandId: number): Observable<Perfume[]> {
    return this.http.get<any>(`${API_URL}/brands/public/${brandId}/perfumes`)
      .pipe(
        map(response => {
          console.log('Brand perfumes API Response:', response);
          if (response && response.status === 'success' && response.data) {
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
        map(response => {
          console.log('Categories API Response:', response);
          if (response && response.status === 'success' && response.data) {
            return response.data;
          }
          console.warn('Unexpected response format for categories:', response);
          return [];
        }),
        catchError(this.handleError)
      );
  }

  // ========== BÚSQUEDA AVANZADA ==========
  
  searchProducts(query: string): Observable<Perfume[]> {
    return this.getProducts(0, 50, query);
  }

  // ========== MANEJO DE ERRORES MEJORADO ==========
  
  private handleError(error: HttpErrorResponse) {
    console.error('API Error Details:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      error: error.error,
      message: error.message
    });
    
    let errorMessage = 'Error desconocido';
    
    if (error.status === 0) {
      errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    } else if (error.status === 403) {
      errorMessage = 'Acceso denegado. No tienes permisos para acceder a este recurso.';
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado.';
    } else if (error.status >= 500) {
      errorMessage = 'Error del servidor. Intenta nuevamente más tarde.';
    } else {
      errorMessage = `Error ${error.status}: ${error.message}`;
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