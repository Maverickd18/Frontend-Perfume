import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  rememberMe: boolean = false;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.resetForm();
  }

  resetForm() {
    this.loginForm.reset();
    this.rememberMe = false;
  }

  async onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      const loading = await this.loadingCtrl.create({
        message: 'Iniciando sesión...'
      });
      await loading.present();

      const loginData: LoginRequest = this.loginForm.value;

      console.log('Datos de login enviados:', loginData);

      this.authService.login(loginData).subscribe({
        next: (response) => {
          loading.dismiss();
          this.isLoading = false;
          console.log('Login exitoso - Respuesta completa:', response);
          
          if (response.usuario && response.usuario.rol) {
            console.log('Redirigiendo con rol:', response.usuario.rol);
            this.redirectByRole(response.usuario.rol);
          } else {
            console.error('Estructura de usuario no válida:', response);
            this.showErrorAlert('Error en la estructura de datos del usuario');
          }
        },
        error: (error) => {
          loading.dismiss();
          this.isLoading = false;
          console.error('Error completo en login:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Error response:', error.error);
          
          let errorMessage = 'Error al iniciar sesión';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.status === 401) {
            errorMessage = 'Credenciales incorrectas';
          } else if (error.status === 0) {
            errorMessage = 'No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.';
          } else if (error.status === 404) {
            errorMessage = 'Endpoint no encontrado. Verifica la URL del servidor.';
          }
          
          this.showErrorAlert(errorMessage);
        }
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  private redirectByRole(rol: string) {
    console.log('Redirigiendo con rol:', rol);
    
    switch (rol.toUpperCase()) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'VENDEDOR':
        this.router.navigate(['/seller']);
        break;
      case 'CLIENTE':
        this.router.navigate(['/home']);
        break;
      default:
        console.warn('Rol no reconocido:', rol, 'redirigiendo a home');
        this.router.navigate(['/home']);
        break;
    }
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  onGoogleLogin() {
    console.log('Google login');
  }

  onFacebookLogin() {
    console.log('Facebook login');
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getEmailError(): string {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.hasError('required') && emailControl?.touched) {
      return 'El correo electrónico es requerido';
    }
    if (emailControl?.hasError('email') && emailControl?.touched) {
      return 'Ingrese un correo electrónico válido';
    }
    return '';
  }

  getPasswordError(): string {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl?.hasError('required') && passwordControl?.touched) {
      return 'La contraseña es requerida';
    }
    if (passwordControl?.hasError('minlength') && passwordControl?.touched) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }
}