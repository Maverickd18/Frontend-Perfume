import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone:false
})
export class ForgotPasswordPage implements OnInit {
  forgotPasswordForm: FormGroup;
  emailSent: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private alertController: AlertController
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.resetForm();
  }
    resetForm() {
    this.forgotPasswordForm.reset();
    this.emailSent = false;
  }

  async onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.get('email')?.value;
      console.log('Password reset request for:', email);
      
      // Aquí iría la lógica para enviar el correo de recuperación
      this.emailSent = true;
      
      // Mostrar alerta de confirmación
      const alert = await this.alertController.create({
        header: 'Correo Enviado',
        message: `Se ha enviado un enlace de recuperación a ${email}. Por favor revisa tu bandeja de entrada.`,
        buttons: [{
          text: 'OK',
          handler: () => {
            this.goToLogin();
          }
        }]
      });
      await alert.present();
    } else {
      this.markFormGroupTouched(this.forgotPasswordForm);
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
    const emailControl = this.forgotPasswordForm.get('email');
    if (emailControl?.hasError('required') && emailControl?.touched) {
      return 'El correo electrónico es requerido';
    }
    if (emailControl?.hasError('email') && emailControl?.touched) {
      return 'Ingrese un correo electrónico válido';
    }
    return '';
  }
}