import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
<<<<<<< HEAD
  standalone: false
=======
   standalone: false,
>>>>>>> client
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  acceptTerms: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.registerForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      userType: ['client', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.resetForm();
  }

 resetForm() {
  this.registerForm.reset({
    userType: 'client'
  });
  this.acceptTerms = false;
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
    if (this.registerForm.valid && this.acceptTerms) {
      console.log('Register attempt:', this.registerForm.value);
      this.router.navigate(['/login']);
    } else {
      if (!this.acceptTerms) {
        console.log('Debe aceptar los términos y condiciones');
      }
      this.markFormGroupTouched(this.registerForm);
    }
  }

  onGoogleRegister() {
    console.log('Google register');
  }

  onFacebookRegister() {
    console.log('Facebook register');
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

  getPhoneError(): string {
    const control = this.registerForm.get('phone');
    if (control?.hasError('required') && control?.touched) {
      return 'El teléfono es requerido';
    }
    if (control?.hasError('pattern') && control?.touched) {
      return 'Ingrese un número de teléfono válido (10 dígitos)';
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
}