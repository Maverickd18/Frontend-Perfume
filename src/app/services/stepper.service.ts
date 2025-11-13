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
    imageUrl?: string;
  };
  selectedBrand?: number;
  selectedCategory?: number;
  brands: any[];
  categories: any[];
  brandImage?: File | null;
  categoryImage?: File | null;
  perfumeImage?: File | null;
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
      releaseDate: new Date().toISOString().split('T')[0],
      imageUrl: ''
    },
    brands: [],
    categories: [],
    brandImage: null,
    categoryImage: null,
    perfumeImage: null
  };

  private stateSubject = new BehaviorSubject<StepperState>(this.initialState);
  public state$ = this.stateSubject.asObservable();

  constructor() {
    console.log('StepperService initialized');
  }

  openStepper(): void {
    console.log('🔄 StepperService: Abriendo stepper...');
    const currentState = this.stateSubject.value;
    
    const newState: StepperState = {
      ...this.initialState,
      isOpen: true,
      currentStep: 1,
      brands: Array.isArray(currentState.brands) ? currentState.brands : [],
      categories: Array.isArray(currentState.categories) ? currentState.categories : [],
      brandImage: null,
      categoryImage: null,
      perfumeImage: null
    };
    
    console.log('🔄 StepperService: Nuevo estado:', newState);
    this.stateSubject.next(newState);
  }

  closeStepper(): void {
    console.log('🔄 StepperService: Cerrando stepper...');
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...this.initialState,
      brands: Array.isArray(currentState.brands) ? currentState.brands : [],
      categories: Array.isArray(currentState.categories) ? currentState.categories : []
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
      brands: Array.isArray(brands) ? brands : []
    });
  }

  setCategories(categories: any[]): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      categories: Array.isArray(categories) ? categories : []
    });
  }

  setBrandImage(image: File | null): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      brandImage: image
    });
  }

  setCategoryImage(image: File | null): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      categoryImage: image
    });
  }

  setPerfumeImage(image: File | null): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      perfumeImage: image
    });
  }
}