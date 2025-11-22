import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { StepperService, StepperState } from '../../../services/stepper.service';
import { SellerService, Brand, Category } from '../../../services/seller.service';
import { FileUploadService } from '../../../services/file-upload.service';
import { AuthService } from '../../../services/auth.service';
import { lastValueFrom, Subject } from 'rxjs';
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
  useExistingCategory = true; // Por defecto usar categoría existente
  
  brandImagePreview: string | null = null;
  categoryImagePreview: string | null = null;
  perfumeImagePreview: string | null = null;
  
  destroy$ = new Subject<void>();
  isLoading = false;

  stepErrors: { [key: number]: string } = {};

  constructor(
    private stepperService: StepperService, 
    private sellerService: SellerService,
    private fileUploadService: FileUploadService,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    console.log('StepperComponent: ngOnInit called');
    
    this.stepperService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        console.log('StepperComponent: State received', state);
        this.state = state;
        this.cdRef.detectChanges();
      });

    if (!this.sellerService.canCreatePerfume()) {
      const user = this.authService.getCurrentUser();
      console.error('User does not have permission to create perfumes:', user);
      alert('No tienes permisos para crear perfumes. Tu rol actual es: ' + (user?.role || 'No definido'));
      this.closeStepper();
      return;
    }

    this.loadExistingData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadExistingData() {
    this.sellerService.getMyBrands().subscribe({
      next: (brands) => {
        this.stepperService.setBrands(brands || []);
        this.cdRef.detectChanges();
      },
      error: (error) => {
        console.error('Error loading my brands:', error);
      }
    });

    this.sellerService.getCategories().subscribe({
      next: (categories) => {
        this.stepperService.setCategories(categories || []);
        this.cdRef.detectChanges();
      },
      error: (error) => {
        console.error('Error loading categories:', error);
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

  onBrandImageUploaded(file: File | null) {
    this.stepperService.setBrandImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.brandImagePreview = e.target.result;
        this.cdRef.detectChanges();
      };
      reader.readAsDataURL(file);
    } else {
      this.brandImagePreview = null;
      this.cdRef.detectChanges();
    }
  }

  onCategoryImageUploaded(file: File | null) {
    this.stepperService.setCategoryImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.categoryImagePreview = e.target.result;
        this.cdRef.detectChanges();
      };
      reader.readAsDataURL(file);
    } else {
      this.categoryImagePreview = null;
      this.cdRef.detectChanges();
    }
  }

  onPerfumeImageUploaded(file: File | null) {
    this.stepperService.setPerfumeImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.perfumeImagePreview = e.target.result;
        this.cdRef.detectChanges();
      };
      reader.readAsDataURL(file);
    } else {
      this.perfumeImagePreview = null;
      this.cdRef.detectChanges();
    }
  }

  async savePerfume() {
  this.stepErrors = {};

  if (!this.state) {
    alert('Error: Estado no disponible');
    return;
  }

  if (!this.validateAllSteps()) {
    this.showStepErrors();
    return;
  }

  if (!this.sellerService.canCreatePerfume()) {
    alert('No tienes permisos para crear perfumes. Por favor contacta al administrador.');
    return;
  }

  this.isLoading = true;
  this.cdRef.detectChanges();

  try {
    let brandId: number;
    let categoryId: number;
    let perfumeImageUrl: string | null = null;

    console.log('🚀 Starting perfume creation process...');

    // ========== SUBIR IMAGEN DEL PERFUME ==========
    if (this.state.perfumeImage) {
      console.log('📤 Uploading perfume image...');
      try {
        const uploadResponse = await lastValueFrom(this.sellerService.uploadPerfumeImage(this.state.perfumeImage));
        console.log('📨 Upload response:', uploadResponse);

        perfumeImageUrl = uploadResponse.fileUrl || 
                        uploadResponse.url || 
                        uploadResponse.imageUrl;

        if (!perfumeImageUrl && uploadResponse.filePath) {
          perfumeImageUrl = `http://localhost:8080${uploadResponse.filePath}`;
          console.log('🔨 Built image URL from filePath:', perfumeImageUrl);
        }
        console.log('🖼️ Final image URL for perfume:', perfumeImageUrl);
      } catch (error) {
        console.error('❌ Error uploading perfume image:', error);
        // Continuar sin imagen si hay error
      }
    } else {
      console.log('ℹ️ No perfume image selected');
    }

    // ========== CREAR O SELECCIONAR MARCA ==========
    if (this.useExistingBrand && this.state.selectedBrand) {
      brandId = this.state.selectedBrand;
      console.log('🏷️ Using existing brand ID:', brandId);
    } else {
      console.log('🆕 Creating new brand:', this.newBrandName);
      
      if (!this.newBrandName.trim() || !this.newBrandDescription.trim()) {
        throw new Error('Nombre y descripción de marca son obligatorios');
      }

      // En el método savePerfume(), en la sección de creación de marca:
const brandData = {
  name: this.newBrandName.trim(),
  description: this.newBrandDescription.trim(),
  countryOrigin: this.newBrandCountry.trim() || 'No especificado', // ← OBLIGATORIO
  imageUrl: this.brandImagePreview || undefined
};

      const brandResponse = await lastValueFrom(this.sellerService.createMyBrand(brandData));
      
      if (!brandResponse || !brandResponse.id) {
        throw new Error('Failed to create brand - no ID returned from API');
      }
      
      brandId = brandResponse.id;
      console.log('🆔 New brand created with ID:', brandId);
    }

    // ========== CREAR O SELECCIONAR CATEGORÍA ==========
    if (this.useExistingCategory && this.state.selectedCategory) {
      categoryId = this.state.selectedCategory;
      console.log('📂 Using existing category ID:', categoryId);
    } else {
      console.log('🆕 Creating new category:', this.newCategoryName);
      
      if (!this.newCategoryName.trim() || !this.newCategoryDescription.trim()) {
        throw new Error('Nombre y descripción de categoría son obligatorios');
      }

      const categoryData = {
        name: this.newCategoryName.trim(),
        description: this.newCategoryDescription.trim()
      };

      console.log('📤 Creating category with data:', categoryData);
      
      // En el método savePerfume(), en la sección de creación de categorías:
try {
  const categoryResponse = await lastValueFrom(this.sellerService.createCategory(categoryData));
  console.log('✅ Category creation response:', categoryResponse);

  // Asegurarse de que tenemos un ID
  if (!categoryResponse || !categoryResponse.id) {
    throw new Error('No se pudo crear la categoría - el servidor no respondió con un ID');
  }
  
  categoryId = categoryResponse.id;
  console.log('🆔 New category created with ID:', categoryId);
} catch (error: any) {
  console.error('❌ Error creating category:', error);
  throw new Error('Error creando categoría: ' + (error.message || 'Verifica los datos'));
}
    }

    // ========== CREAR PERFUME ==========
    const perfumeData = {
      name: this.state.perfumeData.name.trim(),
      description: this.state.perfumeData.description.trim(),
      price: Number(this.state.perfumeData.price),
      stock: Number(this.state.perfumeData.stock),
      sizeMl: Number(this.state.perfumeData.sizeMl),
      genre: this.state.perfumeData.genre,
      releaseDate: this.state.perfumeData.releaseDate,
      brandId: brandId,
      categoryId: categoryId,
      imageUrl: perfumeImageUrl
    };

    console.log('🎯 Final perfume data to send:', perfumeData);

    // Validaciones
    if (!perfumeData.name) throw new Error('El nombre del perfume es obligatorio');
    if (!perfumeData.description) throw new Error('La descripción del perfume es obligatoria');
    if (perfumeData.price <= 0) throw new Error('El precio debe ser mayor a 0');
    if (perfumeData.stock < 0) throw new Error('El stock no puede ser negativo');
    if (perfumeData.sizeMl <= 0) throw new Error('El tamaño debe ser mayor a 0');

    console.log('📤 Sending perfume creation request...');
    const createdPerfume = await lastValueFrom(this.sellerService.createPerfume(perfumeData));
    console.log('✅ Perfume created successfully:', createdPerfume);

    alert('¡Producto creado exitosamente! 🎉');
    this.closeStepper();

  } catch (error: any) {
    console.error('❌ Error creating product:', error);
    
    let errorMessage = 'Error creando el producto: ';
    
    if (error.message.includes('categoría') || error.message.includes('categoria')) {
      errorMessage += 'Problema con la categoría. ' + error.message;
    } else if (error.message.includes('marca')) {
      errorMessage += 'Problema con la marca. ' + error.message;
    } else if (error.message.includes('permisos')) {
      errorMessage += 'No tienes permisos para realizar esta acción.';
    } else {
      errorMessage += error.message || 'Verifica todos los campos';
    }
    
    alert(errorMessage);
  } finally {
    this.isLoading = false;
    this.cdRef.detectChanges();
  }
}
  private showStepErrors() {
    let errorMessage = 'Por favor completa todos los campos obligatorios:\n\n';
    
    Object.values(this.stepErrors).forEach(error => {
      if (error) {
        errorMessage += `• ${error}\n`;
      }
    });
    
    alert(errorMessage);
  }

  validateCurrentStep(): boolean {
    if (!this.state) return false;

    this.stepErrors[this.state.currentStep] = '';

    let isValid = false;
    switch (this.state.currentStep) {
      case 1:
        isValid = this.isStep1Valid();
        break;
      case 2:
        isValid = this.isStep2Valid();
        break;
      case 3:
        isValid = this.isStep3Valid();
        break;
      case 4:
        isValid = this.isStep4Valid();
        break;
      default:
        isValid = false;
    }

    setTimeout(() => this.cdRef.detectChanges(), 0);
    
    return isValid;
  }

  validateAllSteps(): boolean {
    return this.isStep1Valid() && this.isStep2Valid() && this.isStep3Valid() && this.isStep4Valid();
  }

  isStep1Valid(): boolean {
    if (!this.state) return false;

    const errors: string[] = [];
    
    if (!this.state.perfumeData.name.trim()) {
      errors.push('Nombre del producto es obligatorio');
    }
    
    if (!this.state.perfumeData.description.trim()) {
      errors.push('Descripción del producto es obligatoria');
    }
    
    if (!this.state.perfumeData.genre) {
      errors.push('Género es obligatorio');
    }

    this.stepErrors[1] = errors.join(', ');
    return errors.length === 0;
  }

  isStep2Valid(): boolean {
    if (!this.state) return false;

    const errors: string[] = [];
    
    if (!this.state.perfumeData.price || this.state.perfumeData.price <= 0) {
      errors.push('Precio debe ser mayor a 0');
    }
    
    if (this.state.perfumeData.stock === null || this.state.perfumeData.stock === undefined || this.state.perfumeData.stock < 0) {
      errors.push('Stock no puede ser negativo');
    }
    
    if (!this.state.perfumeData.sizeMl || this.state.perfumeData.sizeMl <= 0) {
      errors.push('Tamaño debe ser mayor a 0');
    }
    
    if (!this.state.perfumeData.releaseDate) {
      errors.push('Fecha de lanzamiento es obligatoria');
    }

    this.stepErrors[2] = errors.join(', ');
    return errors.length === 0;
  }

  isStep3Valid(): boolean {
    if (!this.state) return false;

    const errors: string[] = [];
    
    if (this.useExistingCategory) {
      if (!this.state.selectedCategory) {
        errors.push('Debes seleccionar una categoría existente');
      }
    } else {
      if (!this.newCategoryName.trim()) {
        errors.push('Nombre de categoría es obligatorio');
      }
      
      if (!this.newCategoryDescription.trim()) {
        errors.push('Descripción de categoría es obligatoria');
      }
    }

    this.stepErrors[3] = errors.join(', ');
    return errors.length === 0;
  }

  isStep4Valid(): boolean {
    if (!this.state) return false;

    const errors: string[] = [];
    
    if (this.useExistingBrand) {
      if (!this.state.selectedBrand) {
        errors.push('Debes seleccionar una marca existente');
      }
    } else {
      if (!this.newBrandName.trim()) {
        errors.push('Nombre de marca es obligatorio');
      }
      
      if (!this.newBrandDescription.trim()) {
        errors.push('Descripción de marca es obligatoria');
      }
    }

    this.stepErrors[4] = errors.join(', ');
    return errors.length === 0;
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
    this.useExistingCategory = true;
    this.brandImagePreview = null;
    this.categoryImagePreview = null;
    this.perfumeImagePreview = null;
    this.stepErrors = {};
    this.cdRef.detectChanges();
  }
}