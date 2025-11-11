import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StepperComponent } from './stepper.component';
import { StepperService } from '../../../services/stepper.service';
import { SellerService } from '../../../services/seller.service';

describe('StepperComponent', () => {
  let component: StepperComponent;
  let fixture: ComponentFixture<StepperComponent>;
  let stepperService: jasmine.SpyObj<StepperService>;
  let sellerService: jasmine.SpyObj<SellerService>;

  beforeEach(async () => {
    const stepperServiceSpy = jasmine.createSpyObj('StepperService', ['getState', 'nextStep', 'previousStep', 'goToStep', 'selectCategory', 'selectBrand', 'addNewBrand', 'savePerfume', 'closeStepper']);
    const sellerServiceSpy = jasmine.createSpyObj('SellerService', ['getStore', 'addPerfume']);

    await TestBed.configureTestingModule({
      declarations: [ StepperComponent ],
      providers: [
        { provide: StepperService, useValue: stepperServiceSpy },
        { provide: SellerService, useValue: sellerServiceSpy }
      ]
    })
    .compileComponents();

    stepperService = TestBed.inject(StepperService) as jasmine.SpyObj<StepperService>;
    sellerService = TestBed.inject(SellerService) as jasmine.SpyObj<SellerService>;

    fixture = TestBed.createComponent(StepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize state from service', () => {
    expect(component.state).toBeDefined();
  });

  it('should call nextStep from service', () => {
    component.nextStep();
    expect(stepperService.nextStep).toHaveBeenCalled();
  });

  it('should call previousStep from service', () => {
    component.previousStep();
    expect(stepperService.previousStep).toHaveBeenCalled();
  });

  it('should call goToStep from service', () => {
    component.goToStep(2);
    expect(stepperService.goToStep).toHaveBeenCalledWith(2);
  });

  it('should call selectCategory from service', () => {
    component.selectCategory('Floral');
    expect(stepperService.selectCategory).toHaveBeenCalledWith('Floral');
  });

  it('should call selectBrand from service', () => {
    component.selectBrand('Dior');
    expect(stepperService.selectBrand).toHaveBeenCalledWith('Dior');
  });

  it('should call closeStepper from service', () => {
    component.closeStepper();
    expect(stepperService.closeStepper).toHaveBeenCalled();
  });
});
