import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CartService, CartItem } from '../../services/cart.service';
import { CheckoutService, ShippingAddress, PaymentMethod, CheckoutRequest, OrderItem } from '../../services/checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: false
})
export class CheckoutPage implements OnInit, OnDestroy {
  // Formularios reactivos
  shippingForm!: FormGroup;
  paymentForm!: FormGroup;

  // Datos del carrito
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  shipping: number = 0;
  tax: number = 0;
  total: number = 0;

  // Métodos de pago
  selectedPaymentMethod: 'card' | 'transfer' | 'cash_on_delivery' = 'card';
  paymentMethods: Array<{ id: 'card' | 'transfer' | 'cash_on_delivery'; name: string; icon: string }> = [
    { id: 'card', name: 'Tarjeta de Crédito/Débito', icon: 'card-outline' },
    { id: 'transfer', name: 'Transferencia Bancaria', icon: 'swap-horizontal-outline' },
    { id: 'cash_on_delivery', name: 'Pago Contraentrega', icon: 'cash-outline' }
  ];

  // Estado de la UI
  currentStep: 'shipping' | 'payment' | 'review' = 'shipping';
  isProcessing: boolean = false;
  showCardDetails: boolean = false;

  // Subject para limpiar suscripciones
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

  // ============================================
  // INICIALIZACIÓN
  // ============================================

  private initializeForms() {
    // Formulario de datos de envío
    this.shippingForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });

    // Formulario de pago
    this.paymentForm = this.formBuilder.group({
      // Campos para tarjeta
      cardNumber: ['', []],
      cardHolderName: ['', []],
      expirationDate: ['', []],
      cvv: ['', []],
      // Campo para transferencia
      transferReference: ['', []]
    });

    // Escuchar cambios en la dirección para calcular envío
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
      });
  }

  // ============================================
  // CÁLCULOS
  // ============================================

  private calculateTotals() {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.total = this.subtotal + this.shipping + this.tax;
  }

  private calculateShipping() {
    const address: ShippingAddress = this.shippingForm.value;
    
    // Llamar al servicio para calcular envío real
    this.checkoutService.calculateShipping(address)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.shipping = response.shipping;
          this.tax = response.tax;
          this.calculateTotals();
        },
        error: (error) => {
          console.error('Error calculando envío:', error);
          // Valores por defecto en caso de error
          this.shipping = 50;
          this.tax = this.subtotal * 0.16;
          this.calculateTotals();
        }
      });
  }

  // ============================================
  // NAVEGACIÓN ENTRE PASOS
  // ============================================

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

  // ============================================
  // MÉTODOS DE PAGO
  // ============================================

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

    // Limpiar todos los validadores
    cardNumber?.clearValidators();
    cardHolderName?.clearValidators();
    expirationDate?.clearValidators();
    cvv?.clearValidators();
    transferReference?.clearValidators();

    // Agregar validadores según el método seleccionado
    if (this.selectedPaymentMethod === 'card') {
      cardNumber?.setValidators([Validators.required, Validators.pattern(/^\d{13,19}$/)]);
      cardHolderName?.setValidators([Validators.required, Validators.minLength(3)]);
      expirationDate?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
      cvv?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
    } else if (this.selectedPaymentMethod === 'transfer') {
      transferReference?.setValidators([Validators.required, Validators.minLength(6)]);
    }

    // Actualizar estado de validación
    cardNumber?.updateValueAndValidity();
    cardHolderName?.updateValueAndValidity();
    expirationDate?.updateValueAndValidity();
    cvv?.updateValueAndValidity();
    transferReference?.updateValueAndValidity();
  }

  private isPaymentFormValid(): boolean {
    if (this.selectedPaymentMethod === 'cash_on_delivery') {
      return true;
    }
    return this.paymentForm.valid;
  }

  // ============================================
  // FORMATO DE CAMPOS
  // ============================================

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

  // ============================================
  // PROCESAR ORDEN
  // ============================================

  async processOrder() {
    if (this.isProcessing) return;

    // Validar que haya items en el carrito
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
      // Preparar datos de la orden
      const orderData: CheckoutRequest = {
        shippingAddress: this.shippingForm.value,
        paymentMethod: this.preparePaymentMethod(),
        items: this.prepareOrderItems(),
        subtotal: this.subtotal,
        shipping: this.shipping,
        tax: this.tax,
        total: this.total
      };

      // Enviar orden al backend
      this.checkoutService.processOrder(orderData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: async (response) => {
            await loading.dismiss();
            this.isProcessing = false;

            // Mostrar confirmación
            await this.showOrderConfirmation(response);

            // Limpiar carrito
            this.cartService.clearCart();

            // Redirigir a página de confirmación o inicio
            this.router.navigate(['/home']);
          },
          error: async (error) => {
            await loading.dismiss();
            this.isProcessing = false;
            console.error('Error procesando orden:', error);
            this.showErrorAlert(error);
          }
        });

    } catch (error) {
      await loading.dismiss();
      this.isProcessing = false;
      console.error('Error inesperado:', error);
      this.showToast('Error inesperado al procesar la orden', 'danger');
    }
  }

  private preparePaymentMethod(): PaymentMethod {
    const paymentMethod: PaymentMethod = {
      type: this.selectedPaymentMethod
    };

    if (this.selectedPaymentMethod === 'card') {
      paymentMethod.cardNumber = this.paymentForm.value.cardNumber?.replace(/\s/g, '');
      paymentMethod.cardHolderName = this.paymentForm.value.cardHolderName;
      paymentMethod.expirationDate = this.paymentForm.value.expirationDate;
      paymentMethod.cvv = this.paymentForm.value.cvv;
    } else if (this.selectedPaymentMethod === 'transfer') {
      paymentMethod.transferReference = this.paymentForm.value.transferReference;
    }

    return paymentMethod;
  }

  private prepareOrderItems(): OrderItem[] {
    return this.cartItems.map(item => ({
      productId: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      image: item.image
    }));
  }

  // ============================================
  // UI HELPERS
  // ============================================

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
                <strong>ID de Orden:</strong> ${response.orderId}<br>
                ${response.trackingNumber ? '<strong>Número de Seguimiento:</strong> ' + response.trackingNumber : ''}`,
      buttons: ['OK']
    });
    await alert.present();
  }

  private async showErrorAlert(error: any) {
    const message = error.error?.message || 'Hubo un error al procesar tu orden. Por favor intenta nuevamente.';
    
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

  // ============================================
  // GETTERS PARA VALIDACIÓN DE FORMULARIOS
  // ============================================

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
