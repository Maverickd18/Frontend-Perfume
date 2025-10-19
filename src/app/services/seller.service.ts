import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

  constructor() { }

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

}
