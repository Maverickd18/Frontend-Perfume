import { Component, OnInit, OnDestroy } from '@angular/core';
import { StepperService, StepperState } from '../../../services/stepper.service';
import { SellerService, Perfume } from '../../../services/seller.service';
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
  destroy$ = new Subject<void>();

  constructor(private stepperService: StepperService, private sellerService: SellerService) { }

  ngOnInit() {
    this.stepperService.getState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.state = state;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  nextStep() {
    this.stepperService.nextStep();
  }

  previousStep() {
    this.stepperService.previousStep();
  }

  goToStep(step: number) {
    this.stepperService.goToStep(step);
  }

  selectCategory(category: string) {
    this.stepperService.selectCategory(category);
  }

  selectBrand(brand: string) {
    this.stepperService.selectBrand(brand);
  }

  addNewBrand() {
    if (this.newBrandName.trim()) {
      this.stepperService.addNewBrand(this.newBrandName.trim());
      this.newBrandName = '';
    }
  }

  savePerfume() {
    if (!this.state || !this.state.perfumeData.nombre.trim()) {
      alert('Please complete all required fields');
      return;
    }

    const perfume: Perfume = {
      nombre: this.state.perfumeData.nombre,
      descripcion: this.state.perfumeData.descripcion,
      precio: this.state.perfumeData.precio,
      stock: this.state.perfumeData.stock,
      tamano_ml: this.state.perfumeData.tamano_ml,
      genero: this.state.perfumeData.genero,
      categoria: this.state.selectedCategory || '',
      marca: this.state.selectedBrand || ''
    };

    this.sellerService.addPerfume(perfume);
    this.closeStepper();
  }

  closeStepper() {
    this.stepperService.closeStepper();
  }

  updatePerfumeData(field: string, value: any) {
    this.stepperService.updatePerfumeData({ [field]: value });
  }

  isStep1Valid(): boolean {
    return this.state ? this.state.perfumeData.nombre.trim() !== '' : false;
  }

  isStep2Valid(): boolean {
    return this.state ? (this.state.perfumeData.nombre.trim() !== '' && 
                         this.state.perfumeData.descripcion.trim() !== '' &&
                         this.state.perfumeData.precio > 0) : false;
  }

  isStep3Valid(): boolean {
    return this.state ? this.state.selectedCategory !== '' : false;
  }

  isStep4Valid(): boolean {
    return this.state ? this.state.selectedBrand !== '' : false;
  }

}
