import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface StepperState {
  currentStep: number;
  isOpen: boolean;
  storeCreated: boolean;
  perfumeData: {
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    tamano_ml: number;
    genero: string;
    categoria?: string;
    marca?: string;
  };
  categories: string[];
  brands: string[];
  selectedCategory?: string;
  selectedBrand?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StepperService {

  private initialState: StepperState = {
    currentStep: 1,
    isOpen: false,
    storeCreated: false,
    perfumeData: {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      tamano_ml: 100,
      genero: '',
      categoria: '',
      marca: ''
    },
    categories: ['Floral', 'Oriental', 'Fresh', 'Wood', 'Fruity', 'Spicy'],
    brands: ['Brand A', 'Brand B', 'Brand C', 'Generic'],
    selectedCategory: '',
    selectedBrand: ''
  };

  private state$ = new BehaviorSubject<StepperState>(this.initialState);

  constructor() { }

  getState(): Observable<StepperState> {
    return this.state$.asObservable();
  }

  getCurrentState(): StepperState {
    return this.state$.value;
  }

  openStepper() {
    const current = this.state$.value;
    this.state$.next({ ...current, isOpen: true, currentStep: 1 });
  }

  closeStepper() {
    const current = this.state$.value;
    this.state$.next({ 
      ...current, 
      isOpen: false,
      perfumeData: {
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        tamano_ml: 100,
        genero: '',
        categoria: '',
        marca: ''
      },
      selectedCategory: '',
      selectedBrand: ''
    });
  }

  goToStep(step: number) {
    const current = this.state$.value;
    if (step >= 1 && step <= 4) {
      this.state$.next({ ...current, currentStep: step });
    }
  }

  nextStep() {
    const current = this.state$.value;
    if (current.currentStep < 4) {
      this.state$.next({ ...current, currentStep: current.currentStep + 1 });
    }
  }

  previousStep() {
    const current = this.state$.value;
    if (current.currentStep > 1) {
      this.state$.next({ ...current, currentStep: current.currentStep - 1 });
    }
  }

  updatePerfumeData(data: Partial<StepperState['perfumeData']>) {
    const current = this.state$.value;
    this.state$.next({
      ...current,
      perfumeData: { ...current.perfumeData, ...data }
    });
  }

  selectCategory(category: string) {
    const current = this.state$.value;
    this.state$.next({ ...current, selectedCategory: category });
  }

  selectBrand(brand: string) {
    const current = this.state$.value;
    this.state$.next({ ...current, selectedBrand: brand });
  }

  addNewBrand(brand: string) {
    const current = this.state$.value;
    if (!current.brands.includes(brand)) {
      const newBrands = [...current.brands, brand];
      this.state$.next({ ...current, brands: newBrands, selectedBrand: brand });
    }
  }

  setStoreCreated(created: boolean) {
    const current = this.state$.value;
    this.state$.next({ ...current, storeCreated: created });
  }

  getPerfumeData() {
    return this.state$.value.perfumeData;
  }

  reset() {
    this.state$.next(this.initialState);
  }
}
