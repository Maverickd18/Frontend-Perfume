import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
<<<<<<< HEAD
<<<<<<< HEAD
import { AuthService } from 'src/app/services/auth';

=======
import { User } from 'src/models/user';
import { AuthService } from 'src/app/services/auth-service';
>>>>>>> a9afdbc3660898d22baaed6bb0de8a0caae1cba2
=======
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService, LoginRequest } from '../../services/auth.service';
>>>>>>> 41607925e492db535f124d8cc06bb883e597727a

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  rememberMe: boolean = false;
<<<<<<< HEAD
  loading = false;
  errorMessage = '';
=======
  isLoading: boolean = false;
>>>>>>> 41607925e492db535f124d8cc06bb883e597727a

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
<<<<<<< HEAD
    private authService: AuthService
=======
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
>>>>>>> 41607925e492db535f124d8cc06bb883e597727a
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

<<<<<<< HEAD
  onLogin() {
<<<<<<< HEAD
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('✅ Login exitoso:', response);
          localStorage.setItem('token', response.token);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('❌ Error al iniciar sesión:', err);
          alert('Correo o contraseña incorrectos');
=======
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
>>>>>>> 41607925e492db535f124d8cc06bb883e597727a
        }
      });
    } else {
=======
    if (this.loginForm.invalid) {
>>>>>>> a9afdbc3660898d22baaed6bb0de8a0caae1cba2
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const user: User = this.loginForm.value;

    this.authService.login(user).subscribe({
      next: (res) => {
        console.log('✅ Login correcto:', res);

        if (res && res.token) {
          this.authService.saveToken(res.token);
          this.loading = false;
          this.router.navigate(['/home']);
        } else {
          this.loading = false;
          this.errorMessage = 'Respuesta inválida del servidor.';
        }
      },
      error: (err) => {
        console.error('❌ Error en login:', err);
        this.loading = false;
        if (err.status === 401) {
          this.errorMessage = 'Correo o contraseña incorrectos';
        } else {
          this.errorMessage = 'Error al conectar con el servidor';
        }
      }
    });
  }

<<<<<<< HEAD
<<<<<<< HEAD
=======
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

>>>>>>> 41607925e492db535f124d8cc06bb883e597727a
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
<<<<<<< HEAD
=======
  onGoogleLogin() { console.log('Google login'); }
  onFacebookLogin() { console.log('Facebook login'); }
  goToRegister() { this.router.navigate(['/register']); }
  onForgotPassword() { console.log('Forgot password'); }
>>>>>>> a9afdbc3660898d22baaed6bb0de8a0caae1cba2
=======
>>>>>>> 41607925e492db535f124d8cc06bb883e597727a

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
    });
  }

  getEmailError(): string {
    const c = this.loginForm.get('email');
    if (c?.hasError('required') && c?.touched) return 'El correo electrónico es requerido';
    if (c?.hasError('email') && c?.touched) return 'Ingrese un correo electrónico válido';
    return '';
  }

  getPasswordError(): string {
    const c = this.loginForm.get('password');
    if (c?.hasError('required') && c?.touched) return 'La contraseña es requerida';
    if (c?.hasError('minlength') && c?.touched) return 'Debe tener al menos 6 caracteres';
    return '';
  }
}
