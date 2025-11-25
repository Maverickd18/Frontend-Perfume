import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  LoadingController, 
  AlertController, 
  ToastController,
  IonicModule 
} from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CartService, CartItem } from '../../services/cart.service';
import { CheckoutService, CheckoutRequest } from '../../services/checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class CheckoutPage implements OnInit, OnDestroy {
  shippingForm!: FormGroup;
  paymentForm!: FormGroup;

  cartItems: CartItem[] = [];
  subtotal: number = 0;
  shipping: number = 50;
  tax: number = 0;
  total: number = 0;

  selectedPaymentMethod: 'card' | 'transfer' | 'cash_on_delivery' = 'card';
  paymentMethods: Array<{ id: 'card' | 'transfer' | 'cash_on_delivery'; name: string; icon: string }> = [
    { id: 'card', name: 'Tarjeta de Crédito/Débito', icon: 'card-outline' },
    { id: 'transfer', name: 'Transferencia Bancaria', icon: 'swap-horizontal-outline' },
    { id: 'cash_on_delivery', name: 'Pago Contraentrega', icon: 'cash-outline' }
  ];

  currentStep: 'shipping' | 'payment' | 'review' = 'shipping';
  isProcessing: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.initializeForms();
    this.loadCartData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms() {
    this.shippingForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.paymentForm = this.formBuilder.group({
      cardNumber: ['', []],
      cardHolderName: ['', []],
      expirationDate: ['', []],
      cvv: ['', []],
      transferReference: ['', []]
    });

    this.shippingForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.shippingForm.valid) {
          this.calculateShipping();
        }
      });
  }

  private loadCartData() {
    this.cartService.getCartItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartItems = items;
        this.calculateTotals();
        console.log('Cart items loaded:', items);
      });
  }

  private calculateTotals() {
    this.subtotal = this.cartService.getCartSubtotal();
    this.tax = this.subtotal * 0.16;
    this.total = this.subtotal + this.shipping + this.tax;
  }

  private calculateShipping() {
    const address = this.shippingForm.value;
    
    this.checkoutService.calculateShipping(address)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.shipping = response.shipping;
          this.tax = this.subtotal * response.tax;
          this.calculateTotals();
        },
        error: (error) => {
          console.error('Error calculando envío:', error);
          this.tax = this.subtotal * 0.16;
          this.calculateTotals();
        }
      });
  }

  goToPayment() {
    if (this.shippingForm.valid) {
      this.currentStep = 'payment';
      this.updatePaymentValidators();
    } else {
      this.showValidationErrors(this.shippingForm);
    }
  }

  goToReview() {
    if (this.isPaymentFormValid()) {
      this.currentStep = 'review';
    } else {
      this.showValidationErrors(this.paymentForm);
    }
  }

  goToShipping() {
    this.currentStep = 'shipping';
  }

  goBackToPayment() {
    this.currentStep = 'payment';
  }

  selectPaymentMethod(method: 'card' | 'transfer' | 'cash_on_delivery') {
    this.selectedPaymentMethod = method;
    this.updatePaymentValidators();
  }

  private updatePaymentValidators() {
    const cardNumber = this.paymentForm.get('cardNumber');
    const cardHolderName = this.paymentForm.get('cardHolderName');
    const expirationDate = this.paymentForm.get('expirationDate');
    const cvv = this.paymentForm.get('cvv');
    const transferReference = this.paymentForm.get('transferReference');

    // Limpiar validadores
    [cardNumber, cardHolderName, expirationDate, cvv, transferReference].forEach(control => {
      control?.clearValidators();
      control?.updateValueAndValidity();
    });

    // Agregar validadores según el método seleccionado
    if (this.selectedPaymentMethod === 'card') {
      cardNumber?.setValidators([Validators.required, Validators.pattern(/^\d{13,19}$/)]);
      cardHolderName?.setValidators([Validators.required, Validators.minLength(3)]);
      expirationDate?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
      cvv?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
    } else if (this.selectedPaymentMethod === 'transfer') {
      transferReference?.setValidators([Validators.required, Validators.minLength(6)]);
    }

    // Actualizar validación
    [cardNumber, cardHolderName, expirationDate, cvv, transferReference].forEach(control => {
      control?.updateValueAndValidity();
    });
  }

  // Cambiado de private a public para que el template pueda acceder
  isPaymentFormValid(): boolean {
    if (this.selectedPaymentMethod === 'cash_on_delivery') {
      return true;
    }
    return this.paymentForm.valid;
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.paymentForm.patchValue({ cardNumber: formattedValue }, { emitEvent: false });
  }

  formatExpirationDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.paymentForm.patchValue({ expirationDate: value }, { emitEvent: false });
  }

  async processOrder() {
    if (this.isProcessing) return;

    if (this.cartItems.length === 0) {
      this.showToast('El carrito está vacío', 'warning');
      return;
    }

    this.isProcessing = true;
    const loading = await this.loadingController.create({
      message: 'Procesando orden...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const checkoutData: CheckoutRequest = {
        items: this.cartService.getCheckoutItems(),
        shippingAddress: this.formatAddress(this.shippingForm.value),
        billingAddress: this.formatAddress(this.shippingForm.value),
        customerEmail: this.shippingForm.value.email,
        customerPhone: this.shippingForm.value.phone,
        paymentMethod: this.selectedPaymentMethod.toUpperCase()
      };

      console.log('Processing order with data:', checkoutData);

      this.checkoutService.processOrder(checkoutData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: async (response) => {
            await loading.dismiss();
            this.isProcessing = false;

            if (response.status === 'success') {
              await this.showOrderConfirmation(response);
              this.cartService.clearCart();
              
              // Redirigir a página de confirmación o home
              this.router.navigate(['/home'], { 
                queryParams: { orderSuccess: true }
              });
            } else {
              this.showErrorAlert(response.message || 'Error al procesar la orden');
            }
          },
          error: async (error) => {
            await loading.dismiss();
            this.isProcessing = false;
            console.error('Error procesando orden:', error);
            this.showErrorAlert(error.error?.message || 'Hubo un error al procesar tu orden. Por favor intenta nuevamente.');
          }
        });

    } catch (error) {
      await loading.dismiss();
      this.isProcessing = false;
      console.error('Error inesperado:', error);
      this.showToast('Error inesperado al procesar la orden', 'danger');
    }
  }

  private formatAddress(addressData: any): string {
    return `${addressData.address}, ${addressData.city}, C.P. ${addressData.postalCode}`;
  }

  private showValidationErrors(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
    this.showToast('Por favor completa todos los campos requeridos', 'warning');
  }

  private async showOrderConfirmation(response: any) {
    const alert = await this.alertController.create({
      header: '¡Orden Procesada!',
      message: `Tu orden ha sido procesada exitosamente.<br><br>
                <strong>Número de Orden:</strong> ${response.data?.orderNumber}<br>
                <strong>Total:</strong> $${response.data?.total?.toFixed(2)}<br>
                <strong>Estado:</strong> ${response.data?.status}`,
      buttons: [
        {
          text: 'Ver Detalles',
          handler: () => {
            // Aquí puedes navegar a la página de detalles de la orden
            console.log('Ver detalles de orden:', response.data);
          }
        },
        {
          text: 'Continuar Comprando',
          role: 'confirm',
          handler: () => {
            this.router.navigate(['/home']);
          }
        }
      ]
    });
    await alert.present();
  }

  private async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

  // Método para obtener el total de items
  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Getters para validación de formularios
  get fullName() { return this.shippingForm.get('fullName'); }
  get address() { return this.shippingForm.get('address'); }
  get city() { return this.shippingForm.get('city'); }
  get postalCode() { return this.shippingForm.get('postalCode'); }
  get phone() { return this.shippingForm.get('phone'); }
  get email() { return this.shippingForm.get('email'); }

  get cardNumber() { return this.paymentForm.get('cardNumber'); }
  get cardHolderName() { return this.paymentForm.get('cardHolderName'); }
  get expirationDate() { return this.paymentForm.get('expirationDate'); }
  get cvv() { return this.paymentForm.get('cvv'); }
  get transferReference() { return this.paymentForm.get('transferReference'); }
}
