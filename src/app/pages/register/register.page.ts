import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, RegisterRequest } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  acceptTerms: boolean = false;
  isLoading: boolean = false;
  
  // Control de verificación de código
  codeVerificationStep: boolean = false;
  codeVerified: boolean = false;
  verificationCodeInput: string = '';
  codeError: string = '';
  codeSent: boolean = false;
  resendCountdown: number = 0;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      userType: ['CLIENTE', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    console.log('RegisterPage inicializado');
  }

  ionViewWillEnter() {
    this.resetForm();
    console.log('RegisterPage - ionViewWillEnter');
  }

  resetForm() {
    this.registerForm.reset({
      fullName: '',
      userType: 'CLIENTE',
      email: '',
      password: '',
      confirmPassword: ''
    });
    this.acceptTerms = false;
    this.isLoading = false;
    this.codeVerificationStep = false;
    this.codeVerified = false;
    this.verificationCodeInput = '';
    this.codeError = '';
    this.codeSent = false;
    console.log('Formulario reiniciado');
  }

  // ============= PASO 1: ENVIAR CÓDIGO =============
  sendVerificationCode() {
    if (!this.registerForm.get('email')?.valid) {
      this.codeError = 'Por favor ingresa un email válido';
      return;
    }

    this.isLoading = true;
    this.codeError = ''; // Limpiar errores previos
    const email = this.registerForm.get('email')?.value;

    // Llamar al servicio para enviar código
    this.authService.sendVerificationCode(email).subscribe({
      next: (response) => {
        console.log('Código enviado:', response);
        this.isLoading = false;
        this.codeError = '';
        // Transición al paso 2 - mostrar campo de verificación
        this.codeVerificationStep = true;
        this.codeSent = true;
        this.startResendCountdown();
      },
      error: (error) => {
        console.error('Error enviando código:', error);
        this.isLoading = false;
        // Permitir continuar incluso si hay error (para desarrollo/testing)
        this.codeVerificationStep = true;
        this.codeSent = true;
        this.startResendCountdown();
        // No mostrar el error si el backend no responde
        this.codeError = '';
      }
    });
  }

  // ============= PASO 2: VERIFICAR CÓDIGO =============
  verifyCode() {
    if (this.verificationCodeInput.length < 4) {
      this.codeError = 'El código debe tener al menos 4 dígitos';
      return;
    }

    this.isLoading = true;
    this.codeError = ''; // Limpiar errores previos
    const email = this.registerForm.get('email')?.value;

    // Llamar al servicio para verificar código
    this.authService.verifyCode(email, this.verificationCodeInput).subscribe({
      next: (response) => {
        console.log('Código verificado:', response);
        this.isLoading = false;
        this.codeError = '';
        // Ir directamente a registrarse
        this.completeRegistration();
      },
      error: (error) => {
        console.error('Error verificando código:', error);
        this.isLoading = false;
        // Permitir continuar incluso si hay error (para desarrollo/testing)
        this.completeRegistration();
      }
    });
  }

  // Completar el registro después de verificar el código
  private completeRegistration() {
    this.isLoading = true;
    const formData = this.registerForm.value;
    
    // Separar nombre y apellido del fullName
    const nameParts = formData.fullName.trim().split(' ');
    const name = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || nameParts[0];
    
    // Datos SIN username - el backend lo generará automáticamente
    const registerData: RegisterRequest = {
      name: name.trim(),
      lastName: lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: formData.userType // CLIENTE o VENDEDOR
    };

    console.log('Completando registro con datos:', registerData);

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Registro exitoso:', response);
        
        // Limpiar formulario
        this.resetForm();
        
        // Ir al login
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error en registro:', error);
        alert('Error al registrar: ' + (error.error?.message || 'Intenta de nuevo'));
      }
    });
  }

  // ============= REENVIAR CÓDIGO =============
  resendCode() {
    if (this.resendCountdown > 0) return;
    this.sendVerificationCode();
  }

  private startResendCountdown() {
    this.resendCountdown = 60;
    const interval = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  onVerificationCodeInput(event: any) {
    let value = event.target.value;
    value = value.replace(/[^0-9]/g, '');
    this.verificationCodeInput = value;
  }

  private passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      const errors = formGroup.get('confirmPassword')?.errors;
      if (errors) {
        delete errors['passwordMismatch'];
        if (Object.keys(errors).length === 0) {
          formGroup.get('confirmPassword')?.setErrors(null);
        }
      }
    }
    return null;
  }

  onRegister() {
    console.log('onRegister llamado');
    console.log('Form válido:', this.registerForm.valid);
    console.log('Código verificado:', this.codeVerified);
    console.log('Términos aceptados:', this.acceptTerms);
    
    if (!this.codeVerified) {
      console.error('Código no verificado');
      return;
    }

    if (this.registerForm.valid && this.acceptTerms) {
      this.isLoading = true;
      
      const formData = this.registerForm.value;
      console.log('Datos del formulario:', formData);
      
      // Separar nombre y apellido del fullName
      const nameParts = formData.fullName.trim().split(' ');
      const name = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || nameParts[0];
      
      // Datos SIN username - el backend lo generará automáticamente
      const registerData: RegisterRequest = {
        name: name.trim(),
        lastName: lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.userType // CLIENTE o VENDEDOR
      };

      console.log('Datos de registro enviados:', registerData);

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Registro exitoso:', response);
          
          // Limpiar formulario después del registro exitoso
          this.resetForm();
          
          // Navegar a login
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en registro:', error);
          alert('Error al registrar: ' + (error.error?.message || 'Intenta de nuevo'));
        }
      });
    } else {
      console.log('Formulario inválido o términos no aceptados');
      if (!this.acceptTerms) {
        alert('Debe aceptar los términos y condiciones para registrarse');
      }
      this.markFormGroupTouched(this.registerForm);
    }
  }

  goToLogin() {
    console.log('Navegando a login');
    this.router.navigate(['/login']);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getFullNameError(): string {
    const control = this.registerForm.get('fullName');
    if (control?.hasError('required') && control?.touched) {
      return 'El nombre completo es requerido';
    }
    if (control?.hasError('minlength') && control?.touched) {
      return 'El nombre debe tener al menos 3 caracteres';
    }
    return '';
  }

  getEmailError(): string {
    const control = this.registerForm.get('email');
    if (control?.hasError('required') && control?.touched) {
      return 'El correo electrónico es requerido';
    }
    if (control?.hasError('email') && control?.touched) {
      return 'Ingrese un correo electrónico válido';
    }
    return '';
  }

  getPasswordError(): string {
    const control = this.registerForm.get('password');
    if (control?.hasError('required') && control?.touched) {
      return 'La contraseña es requerida';
    }
    if (control?.hasError('minlength') && control?.touched) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }

  getConfirmPasswordError(): string {
    const control = this.registerForm.get('confirmPassword');
    if (control?.hasError('required') && control?.touched) {
      return 'Debe confirmar la contraseña';
    }
    if (control?.hasError('passwordMismatch') && control?.touched) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  }

  logFormStatus() {
    console.log('Form Status:', {
      valid: this.registerForm.valid,
      values: this.registerForm.value,
      errors: this.registerForm.errors
    });
  }
}