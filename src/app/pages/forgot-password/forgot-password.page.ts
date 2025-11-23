// src/app/pages/forgot-password/forgot-password.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false
})
export class ForgotPasswordPage implements OnInit {
  forgotPasswordForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    // Inicialización básica
  }

  ionViewWillEnter() {
    this.resetForm();
  }

  resetForm() {
    this.forgotPasswordForm.reset({
      email: ''
    });
    this.isLoading = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      
      const email = this.forgotPasswordForm.value.email;

      console.log('Solicitud de recuperación para:', email);

      // Aquí llamarías al servicio de recuperación de contraseña
      // Por ahora simularé la respuesta
      this.authService.requestPasswordReset(email).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          console.log('Solicitud exitosa:', response);
          
          this.successMessage = 'Se ha enviado un correo con instrucciones para recuperar tu contraseña.';
          
          // Opcional: redirigir al login después de unos segundos
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Error en recuperación:', error);
          
          if (error.status === 404) {
            this.errorMessage = 'No existe una cuenta con este correo electrónico.';
          } else if (error.status === 0) {
            this.errorMessage = 'Error de conexión. Verifique su internet.';
          } else if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Error en el servidor. Intente nuevamente.';
          }
        }
      });
    } else {
      this.markFormGroupTouched(this.forgotPasswordForm);
      this.errorMessage = 'Por favor ingrese un correo electrónico válido';
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getEmailError(): string {
    const control = this.forgotPasswordForm.get('email');
    if (control?.hasError('required') && control?.touched) {
      return 'El correo electrónico es requerido';
    }
    if (control?.hasError('email') && control?.touched) {
      return 'Ingrese un correo electrónico válido';
    }
    return '';
  }
}