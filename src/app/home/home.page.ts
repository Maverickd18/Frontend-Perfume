import { Component } from '@angular/core';
import { NavController } from '@ionic/angular'; // 👈 necesario para navegación

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  constructor(private navCtrl: NavController) {}

  products = [
    {
      id: 1,
      title: 'Soft Rose',
      description: 'Aromatic floral with soft musk notes.',
      image: 'https://ionicframework.com/docs/img/demos/card-media.png',
      price: 29.99,
      size: '100ml',
      stock: 15
    },
    {
      id: 2,
      title: 'Amber Night',
      description: 'Warm, amber and vanilla tones for evening wear.',
      image: 'https://ionicframework.com/docs/img/demos/card-media.png',
      price: 39.99,
      size: '50ml',
      stock: 8
    },
    {
      id: 3,
      title: 'Citrus Fresh',
      description: 'Bright citrus with green top notes, perfect for daytime.',
      image: 'https://ionicframework.com/docs/img/demos/card-media.png',
      price: 24.99,
      size: '75ml',
      stock: 20
    }
  ];

  // 👉 Métodos de botones del header
  goBack() {
    this.navCtrl.back();
  }

  logout() {
    alert('Sesión cerrada');
    // luego puedes limpiar el storage y redirigir al login
    this.navCtrl.navigateRoot('/login');
  }

  goHome() {
    this.navCtrl.navigateRoot('/home');
  }

  // 👉 Métodos de las cards
  onView(p: any) {
    alert('Ver producto: ' + p.title);
  }

  onBuy(p: any) {
    alert('Comprar producto: ' + p.title + '\nPrecio: $' + p.price);
  }
}
