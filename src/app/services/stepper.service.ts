import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface StepperState {
  isOpen: boolean;
  currentStep: number;
  perfumeData: {
    name: string;
    description: string;
    price: number;
    stock: number;
    sizeMl: number;
    genre: string;
    releaseDate: string;
  };
  selectedBrand?: number;
  selectedCategory?: number;
  brands: any[];
  categories: any[];
}

@Injectable({
  providedIn: 'root'
})
export class StepperService {
  private initialState: StepperState = {
    isOpen: false,
    currentStep: 1,
    perfumeData: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      sizeMl: 100,
      genre: 'Masculino',
      releaseDate: new Date().toISOString().split('T')[0]
    },
    brands: [],
    categories: []
  };

  private stateSubject = new BehaviorSubject<StepperState>(this.initialState);
  public state$ = this.stateSubject.asObservable();

  constructor() {}

  getState() {
    return this.state$;
  }

  openStepper(): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      isOpen: true,
      currentStep: 1
    });
  }

  closeStepper(): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...this.initialState,
      brands: currentState.brands,
      categories: currentState.categories
    });
  }

  nextStep(): void {
    const currentState = this.stateSubject.value;
    if (currentState.currentStep < 4) {
      this.stateSubject.next({
        ...currentState,
        currentStep: currentState.currentStep + 1
      });
    }
  }

  previousStep(): void {
    const currentState = this.stateSubject.value;
    if (currentState.currentStep > 1) {
      this.stateSubject.next({
        ...currentState,
        currentStep: currentState.currentStep - 1
      });
    }
  }

  goToStep(step: number): void {
    const currentState = this.stateSubject.value;
    if (step >= 1 && step <= 4) {
      this.stateSubject.next({
        ...currentState,
        currentStep: step
      });
    }
  }

  updatePerfumeData(updates: Partial<StepperState['perfumeData']>): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      perfumeData: {
        ...currentState.perfumeData,
        ...updates
      }
    });
  }

  selectBrand(brandId: number): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      selectedBrand: brandId
    });
  }

  selectCategory(categoryId: number): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      selectedCategory: categoryId
    });
  }

  setBrands(brands: any[]): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      brands
    });
  }

  setCategories(categories: any[]): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      categories
    });
  }

  setStoreCreated(created: boolean): void {
    // Puedes implementar lógica adicional si es necesario
  }
}