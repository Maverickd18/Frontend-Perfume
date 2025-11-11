import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
<<<<<<< HEAD
import { AuthService } from 'src/app/services/auth';

=======
import { User } from 'src/models/user';
import { AuthService } from 'src/app/services/auth-service';
>>>>>>> a9afdbc3660898d22baaed6bb0de8a0caae1cba2

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  rememberMe: boolean = false;
  loading = false;
  errorMessage = '';

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
    this.resetForm();
  }

  resetForm() {
    this.loginForm.reset();
    this.rememberMe = false;
  }

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
=======
  onGoogleLogin() { console.log('Google login'); }
  onFacebookLogin() { console.log('Facebook login'); }
  goToRegister() { this.router.navigate(['/register']); }
  onForgotPassword() { console.log('Forgot password'); }
>>>>>>> a9afdbc3660898d22baaed6bb0de8a0caae1cba2

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
