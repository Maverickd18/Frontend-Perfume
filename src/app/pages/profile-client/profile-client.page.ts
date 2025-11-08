import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-profile-client',
  templateUrl: './profile-client.page.html',
  styleUrls: ['./profile-client.page.scss'],
})
export class ProfileClientPage implements OnInit {

  constructor(
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {}

  profile = {
    firstName: '',
    lastName: '',
    phone: '',
    cedula: ''
  };

  editing: boolean = false;
  private originalProfile: any = null;

  // 🟣 --- Métodos del header ---
  goBack() {
    this.location.back();
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  logout() {
    // Aquí podrías limpiar el token o llamar al backend más adelante
    console.log('Sesión cerrada (frontend)');
    this.router.navigate(['/login']);
  }
  // 🟣 --- Fin métodos del header ---

  // ✏️ --- Métodos de edición del perfil ---
  save() {
    console.log('Perfil guardado (frontend):', this.profile);
    alert('Perfil guardado localmente.');
    this.editing = false;
  }

  startEdit() {
    this.originalProfile = { ...this.profile };
    this.editing = true;
  }

  cancel() {
    if (this.originalProfile) {
      this.profile = { ...this.originalProfile };
    }
    this.editing = false;
  }
}
