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

  favoriteProducts = [
    {
      id: 1,
      title: 'Soft Rose',
      description: 'Aromatic floral with soft musk notes.',
      image: 'https://ionicframework.com/docs/img/demos/card-media.png',
      price: 29.99,
      size: '100ml',
      brand: 'LuxeCo',
      category: 'floral',
      stock: 15
    },
    {
      id: 7,
      title: 'Garden Petals',
      description: 'Soft blend of iris and peony flowers.',
      image: 'https://ionicframework.com/docs/img/demos/card-media.png',
      price: 27.99,
      size: '100ml',
      brand: 'LuxeCo',
      category: 'floral',
      stock: 25
    },
    {
      id: 4,
      title: 'Midnight Bloom',
      description: 'Deep floral essence with exotic undertones.',
      image: 'https://ionicframework.com/docs/img/demos/card-media.png',
      price: 44.99,
      size: '100ml',
      brand: 'LuxeCo',
      category: 'floral',
      stock: 12
    }
  ];

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

  onCartClick() {
    alert('Carrito de compras');
  }
}
