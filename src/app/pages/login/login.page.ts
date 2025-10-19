import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  rememberMe: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder
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
    if (this.loginForm.valid) {
      console.log('Login attempt:', this.loginForm.value);
      this.router.navigate(['/home']);
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
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