import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

// API Base URL - Cambiar según tu backend
const API_URL = 'http://localhost:3000/api'; // Cambiar a tu URL del backend

export interface Perfume {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  tamano_ml: number;
  genero?: string;
  fecha_lanzamiento?: string;
  marca_id?: number;
  categoria_id?: number;
  categoria?: string;
  marca?: string;
}

export interface Store {
  id: number;
  nombre: string;
  descripcion: string;
  propietario: string;
}

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  private store: Store = {
    id: 0,
    nombre: '',
    descripcion: '',
    propietario: ''
  };

  private perfumes: Perfume[] = [
    {
      id: 1,
      nombre: 'Perfume Rosa Clásico',
      descripcion: 'Perfume elegante con notas de rosa',
      precio: 150,
      stock: 10,
      tamano_ml: 100,
      genero: 'Femenino'
    },
    {
      id: 2,
      nombre: 'Colonia Fresca Masculina',
      descripcion: 'Colonia refrescante para hombre',
      precio: 120,
      stock: 15,
      tamano_ml: 100,
      genero: 'Masculino'
    }
  ];

  private perfumesSubject = new BehaviorSubject<Perfume[]>(this.perfumes);
  public perfumes$ = this.perfumesSubject.asObservable();

  constructor(private http: HttpClient) { }

  getStore(): Store {
    return this.store;
  }

  updateStore(store: Partial<Store>): void {
    this.store = { ...this.store, ...store };
  }

  createStore(store: Store): void {
    this.store = store;
  }

  getPerfumes(): Perfume[] {
    return this.perfumes;
  }

  addPerfume(perfume: Omit<Perfume, 'id'>): Perfume {
    const newPerfume: Perfume = {
      ...perfume,
      id: this.perfumes.length > 0 ? Math.max(...this.perfumes.map(p => p.id || 0)) + 1 : 1
    };
    this.perfumes.push(newPerfume);
    this.perfumesSubject.next([...this.perfumes]);
    return newPerfume;
  }

  deletePerfume(id: number): void {
    this.perfumes = this.perfumes.filter(p => p.id !== id);
    this.perfumesSubject.next([...this.perfumes]);
  }

  updatePerfume(id: number, perfume: Partial<Perfume>): void {
    const index = this.perfumes.findIndex(p => p.id === id);
    if (index !== -1) {
      this.perfumes[index] = { ...this.perfumes[index], ...perfume };
      this.perfumesSubject.next([...this.perfumes]);
    }
  }

  // ============= MÉTODOS HTTP PARA CONSUMIR BACKEND =============
  // NOTA: Estos métodos están listos pero comentados para desarrollo local.
  // Se activarán cuando el backend esté listo.

  /**
   * GET /stores/:id - Obtener tienda del usuario
   */
  /* getStoreFromBackend(storeId: number): Observable<Store> {
    return this.http.get<Store>(`${API_URL}/stores/${storeId}`);
  }

  /**
   * POST /stores - Crear nueva tienda
   */
  /* createStoreBackend(store: Omit<Store, 'id'>): Observable<Store> {
    return this.http.post<Store>(`${API_URL}/stores`, store);
  }

  /**
   * PUT /stores/:id - Actualizar tienda
   */
  /* updateStoreBackend(storeId: number, store: Partial<Store>): Observable<Store> {
    return this.http.put<Store>(`${API_URL}/stores/${storeId}`, store);
  }

  /**
   * GET /stores/:storeId/perfumes - Obtener todos los perfumes de la tienda
   */
  /* getPerfumesFromBackend(storeId: number): Observable<Perfume[]> {
    return this.http.get<Perfume[]>(`${API_URL}/stores/${storeId}/perfumes`);
  }

  /**
   * POST /stores/:storeId/perfumes - Crear nuevo perfume
   */
  /* createPerfumeBackend(storeId: number, perfume: Omit<Perfume, 'id'>): Observable<Perfume> {
    return this.http.post<Perfume>(`${API_URL}/stores/${storeId}/perfumes`, perfume);
  }

  /**
   * PUT /perfumes/:id - Actualizar perfume
   */
  /* updatePerfumeBackend(perfumeId: number, perfume: Partial<Perfume>): Observable<Perfume> {
    return this.http.put<Perfume>(`${API_URL}/perfumes/${perfumeId}`, perfume);
  }

  /**
   * DELETE /perfumes/:id - Eliminar perfume
   */
  /* deletePerfumeBackend(perfumeId: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${API_URL}/perfumes/${perfumeId}`);
  }

  /**
   * GET /categories - Obtener todas las categorías
   */
  /* getCategoriesBackend(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/categories`);
  }

  /**
   * GET /brands - Obtener todas las marcas
   */
  /* getBrandsBackend(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/brands`);
  }

  /**
   * POST /brands - Crear nueva marca
   */
  /* createBrandBackend(brand: { nombre: string }): Observable<any> {
    return this.http.post<any>(`${API_URL}/brands`, brand);
  } */

}
