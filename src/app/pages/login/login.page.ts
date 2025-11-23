import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Inicialización básica
  }

  // ✨ RESETEO AUTOMÁTICO cada vez que entras a la página
  ionViewWillEnter() {
    this.resetForm();
  }

  resetForm() {
    this.loginForm.reset({
      email: '',
      password: ''
    });
    this.isLoading = false;
    this.errorMessage = '';
  }

  onLogin() {
    this.errorMessage = '';
    
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      const loginData: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      console.log('Datos de login enviados:', loginData);

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Login exitoso - Respuesta completa:', response);
          
          // Verificar que tenemos token y usuario en la respuesta
          if (!response.token || !response.usuario) {
            this.errorMessage = 'Error: Respuesta del servidor incompleta';
            return;
          }
          
          // Limpiar formulario después del login exitoso
          this.resetForm();
          
          // Obtener el usuario mapeado del servicio
          const user = this.authService.getCurrentUser();
          console.log('Usuario mapeado después del login:', user);
          
          if (user && user.role) {
            console.log('Redirigiendo según rol:', user.role);
            
            if (user.role === 'VENDEDOR' || user.role === 'ADMIN') {
              this.router.navigate(['/seller']);
            } else {
              this.router.navigate(['/home']);
            }
          } else {
            this.errorMessage = 'Error: No se pudo obtener información del usuario';
            console.error('Usuario no tiene rol definido:', user);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error completo en login:', error);
          
          // Manejar diferentes tipos de errores
          if (error.status === 401) {
            this.errorMessage = 'Credenciales incorrectas. Verifique su email y contraseña.';
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
      this.markFormGroupTouched(this.loginForm);
      this.errorMessage = 'Por favor complete todos los campos correctamente';
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  // ✨ NUEVO: Navegar a la página de recuperación de contraseña
  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getEmailError(): string {
    const control = this.loginForm.get('email');
    if (control?.hasError('required') && control?.touched) {
      return 'El correo electrónico es requerido';
    }
    if (control?.hasError('email') && control?.touched) {
      return 'Ingrese un correo electrónico válido';
    }
    return '';
  }

  getPasswordError(): string {
    const control = this.loginForm.get('password');
    if (control?.hasError('required') && control?.touched) {
      return 'La contraseña es requerida';
    }
    if (control?.hasError('minlength') && control?.touched) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }
}