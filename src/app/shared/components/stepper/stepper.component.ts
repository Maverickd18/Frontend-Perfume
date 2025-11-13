import { Component, OnInit, OnDestroy } from '@angular/core';
import { StepperService, StepperState } from '../../../services/stepper.service';
import { SellerService, Brand, Category } from '../../../services/seller.service';
import { AuthService } from '../../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  standalone: false
})
export class StepperComponent implements OnInit, OnDestroy {

  state: StepperState | null = null;
  newBrandName = '';
  newBrandDescription = '';
  newBrandCountry = '';
  newCategoryName = '';
  newCategoryDescription = '';
  
  useExistingBrand = false;
  useExistingCategory = false;
  
  destroy$ = new Subject<void>();
  isLoading = false;

  constructor(
    private stepperService: StepperService, 
    private sellerService: SellerService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.stepperService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.state = state;
        // Ocultar footer cuando stepper está abierto
        const footer = document.querySelector('app-footer');
        if (footer) {
          if (state.isOpen) {
            (footer as HTMLElement).style.display = 'none';
          } else {
            (footer as HTMLElement).style.display = 'block';
          }
        }
      });

    // Verificar permisos antes de cargar datos
    if (!this.sellerService.canCreatePerfume()) {
      const user = this.authService.getCurrentUser();
      console.error('User does not have permission to create perfumes:', user);
      alert('No tienes permisos para crear perfumes. Tu rol actual es: ' + (user?.rol || 'No definido'));
      this.closeStepper();
      return;
    }

    // Cargar marcas y categorías existentes
    this.loadExistingData();
  }

  ngOnDestroy() {
    // Mostrar footer nuevamente
    const footer = document.querySelector('app-footer');
    if (footer) {
      (footer as HTMLElement).style.display = 'block';
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadExistingData() {
    this.sellerService.getBrands().subscribe({
      next: (brands) => {
        this.stepperService.setBrands(brands);
      },
      error: (error) => {
        console.error('Error loading brands:', error);
        alert('Error loading brands: ' + error.message);
      }
    });

    this.sellerService.getCategories().subscribe({
      next: (categories) => {
        this.stepperService.setCategories(categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        alert('Error loading categories: ' + error.message);
      }
    });
  }

  nextStep() {
    if (this.validateCurrentStep()) {
      this.stepperService.nextStep();
    }
  }

  previousStep() {
    this.stepperService.previousStep();
  }

  goToStep(step: number) {
    this.stepperService.goToStep(step);
  }

  selectCategory(categoryId: number) {
    this.stepperService.selectCategory(categoryId);
  }

  selectBrand(brandId: number) {
    this.stepperService.selectBrand(brandId);
  }

  updatePerfumeData(field: string, value: any) {
    this.stepperService.updatePerfumeData({ [field]: value });
  }

  async savePerfume() {
    if (!this.state || !this.validateAllSteps()) {
      alert('Please complete all required fields');
      return;
    }

    // Verificar permisos nuevamente antes de guardar
    if (!this.sellerService.canCreatePerfume()) {
      alert('No tienes permisos para crear perfumes. Por favor contacta al administrador.');
      return;
    }

    this.isLoading = true;

    try {
      let brandId: number;
      let categoryId: number;

      console.log('Starting perfume creation process...');

      // Crear o usar marca existente
      if (this.useExistingBrand && this.state.selectedBrand) {
        brandId = this.state.selectedBrand;
        console.log('Using existing brand ID:', brandId);
      } else {
        console.log('Creating new brand:', this.newBrandName);
        const newBrand = await this.sellerService.createBrand({
          name: this.newBrandName,
          description: this.newBrandDescription,
          countryOrigin: this.newBrandCountry
        }).toPromise();
        
        if (!newBrand || !newBrand.id) {
          throw new Error('Failed to create brand - no ID returned');
        }
        brandId = newBrand.id;
        console.log('New brand created with ID:', brandId);
      }

      // Crear o usar categoría existente
      if (this.useExistingCategory && this.state.selectedCategory) {
        categoryId = this.state.selectedCategory;
        console.log('Using existing category ID:', categoryId);
      } else {
        console.log('Creating new category:', this.newCategoryName);
        const newCategory = await this.sellerService.createCategory({
          name: this.newCategoryName,
          description: this.newCategoryDescription
        }).toPromise();
        
        if (!newCategory || !newCategory.id) {
          throw new Error('Failed to create category - no ID returned');
        }
        categoryId = newCategory.id;
        console.log('New category created with ID:', categoryId);
      }

      // Crear perfume
      const perfumeData = {
        ...this.state.perfumeData,
        brandId,
        categoryId
      };

      console.log('Creating perfume with data:', perfumeData);

      await this.sellerService.createPerfume(perfumeData).toPromise();

      alert('¡Producto creado exitosamente!');
      this.closeStepper();

    } catch (error: any) {
      console.error('Error creating product:', error);
      
      let errorMessage = 'Error creando el producto. Por favor intenta nuevamente.';
      
      if (error.message.includes('forbidden') || error.message.includes('403')) {
        errorMessage = 'Acceso denegado. No tienes permisos para crear perfumes. Tu rol actual es: ' + (this.authService.getCurrentUser()?.rol || 'No definido');
      } else if (error.message.includes('unauthorized') || error.message.includes('401')) {
        errorMessage = 'Sesión expirada. Por favor inicia sesión nuevamente.';
      } else if (error.message.includes('Network error')) {
        errorMessage = 'Error de conexión. Por favor verifica tu internet.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  closeStepper() {
    this.stepperService.closeStepper();
    this.resetForm();
  }

  private resetForm() {
    this.newBrandName = '';
    this.newBrandDescription = '';
    this.newBrandCountry = '';
    this.newCategoryName = '';
    this.newCategoryDescription = '';
    this.useExistingBrand = false;
    this.useExistingCategory = false;
  }

  // Validaciones
  validateCurrentStep(): boolean {
    if (!this.state) return false;

    switch (this.state.currentStep) {
      case 1:
        return this.isStep1Valid();
      case 2:
        return this.isStep2Valid();
      case 3:
        return this.isStep3Valid();
      case 4:
        return this.isStep4Valid();
      default:
        return false;
    }
  }

  validateAllSteps(): boolean {
    return this.isStep1Valid() && this.isStep2Valid() && this.isStep3Valid() && this.isStep4Valid();
  }

  isStep1Valid(): boolean {
    return this.state ? this.state.perfumeData.name.trim() !== '' : false;
  }

  isStep2Valid(): boolean {
    return this.state ? (
      this.state.perfumeData.name.trim() !== '' && 
      this.state.perfumeData.description.trim() !== '' &&
      this.state.perfumeData.price > 0 &&
      this.state.perfumeData.stock >= 0 &&
      this.state.perfumeData.sizeMl > 0
    ) : false;
  }

  isStep3Valid(): boolean {
    if (!this.state) return false;
    
    if (this.useExistingCategory) {
      return !!this.state.selectedCategory;
    } else {
      return this.newCategoryName.trim() !== '' && this.newCategoryDescription.trim() !== '';
    }
  }

  isStep4Valid(): boolean {
    if (!this.state) return false;
    
    if (this.useExistingBrand) {
      return !!this.state.selectedBrand;
    } else {
      return this.newBrandName.trim() !== '' && this.newBrandDescription.trim() !== '';
    }
  }
}