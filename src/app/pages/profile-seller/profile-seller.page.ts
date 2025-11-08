import { Component, OnInit } from '@angular/core';
import { SellerService, Store } from '../../services/seller.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile-seller',
  templateUrl: './profile-seller.page.html',
  styleUrls: ['./profile-seller.page.scss'],
  standalone: false
})
export class ProfileSellerPage implements OnInit {

  store: Store;
  isEditing = false;
  editStore: Store = {
    id: 1,
    nombre: '',
    descripcion: '',
    propietario: ''
  };

  constructor(private sellerService: SellerService, private location: Location) {
    this.store = this.sellerService.getStore();
  }

  ngOnInit() {
    this.store = this.sellerService.getStore();
    this.editStore = { ...this.store };
  }

  startEdit() {
    this.isEditing = true;
    this.editStore = { ...this.store };
  }

  saveEdit() {
    if (!this.editStore.nombre.trim() || !this.editStore.descripcion.trim() || !this.editStore.propietario.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }
    this.sellerService.updateStore(this.editStore);
    this.store = { ...this.editStore };
    this.isEditing = false;
  }

  cancelEdit() {
    this.isEditing = false;
  }

  onBackClick() {
    this.location.back();
  }

}
