import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-profile-client',
  templateUrl: './profile-client.page.html',
  styleUrls: ['./profile-client.page.scss'],
})
export class ProfileClientPage implements OnInit {

  constructor(
    private router: Router,
    private location: Location,
    private navCtrl: NavController
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

  favoriteProducts: any[] = [];

  goProfile() {
  }

  goHome() {
    this.navCtrl.navigateRoot('/home');
  }

  logout() {
    this.router.navigate(['/login']);
  }

  save() {
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

  onViewProduct(p: any) {
    this.navCtrl.navigateForward('/product-detail', {
      state: { product: p }
    });
  }

  removeFavorite(productId: number) {
    this.favoriteProducts = this.favoriteProducts.filter(p => p.id !== productId);
  }

  onCartClick() {
    alert('Carrito de compras');
  }
}
