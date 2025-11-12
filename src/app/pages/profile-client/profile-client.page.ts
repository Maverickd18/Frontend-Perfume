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

  goProfile() {
    console.log('Ya estás en tu perfil');
  }

  logout() {
    console.log('Sesión cerrada (frontend)');
    this.router.navigate(['/login']);
  }

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
