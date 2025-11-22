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
    console.log('Formulario reiniciado');
  }

  passwordMatchValidator(formGroup: FormGroup) {
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
    console.log('Términos aceptados:', this.acceptTerms);
    
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

      console.log('Datos de registro enviados (SIN username):', registerData);

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Registro exitoso:', response);
          
          // Limpiar formulario después del registro exitoso
          this.resetForm();
          
          // Mostrar mensaje de éxito
          this.showAlert('Éxito', 'Registro completado! Por favor verifica tu email antes de iniciar sesión.');
          
          // Redirigir al login
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en registro:', error);
          
          let errorMessage = 'Error en el registro';
          if (error.message) {
            errorMessage = error.message;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          
          this.showAlert('Error', errorMessage);
        }
      });
    } else {
      console.log('Formulario inválido o términos no aceptados');
      if (!this.acceptTerms) {
        this.showAlert('Términos requeridos', 'Debe aceptar los términos y condiciones para registrarse');
      }
      this.markFormGroupTouched(this.registerForm);
    }
  }

  private showAlert(header: string, message: string) {
    alert(`${header}: ${message}`);
  }

  onGoogleRegister() {
    console.log('Google register - No implementado');
    this.showAlert('No disponible', 'Registro con Google no disponible actualmente');
  }

  onFacebookRegister() {
    console.log('Facebook register - No implementado');
    this.showAlert('No disponible', 'Registro con Facebook no disponible actualmente');
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

  // Método para debug
  logFormStatus() {
    console.log('Form Status:', {
      valid: this.registerForm.valid,
      values: this.registerForm.value,
      errors: this.registerForm.errors
    });
  }
}