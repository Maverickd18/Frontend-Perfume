import { Component, OnInit } from '@angular/core';
import { SellerService, Perfume, Store } from '../../services/seller.service';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.page.html',
  styleUrls: ['./seller.page.scss'],
  standalone: false
})
export class SellerPage implements OnInit {

  store: Store;
  perfumes: Perfume[] = [];
  selectedPerfumes: Set<number> = new Set();
  unreadNotifications = 0;
  newPerfume: Perfume = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    tamano_ml: 100,
    genero: ''
  };
  showAddForm = false;
  editingPerfume: Perfume | null = null;
  showCreateStore = true;
  newStore: Store = {
    id: 1,
    nombre: '',
    descripcion: '',
    propietario: ''
  };

  constructor(private sellerService: SellerService, private notificationService: NotificationService, private router: Router, private location: Location) {
    this.store = this.sellerService.getStore();
  }

  ngOnInit() {
    this.loadPerfumes();
    this.sellerService.perfumes$.subscribe(perfumes => {
      this.perfumes = perfumes;
    });

    // Subscribe to notification updates
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadNotifications = count;
    });
  }

  loadPerfumes() {
    this.perfumes = this.sellerService.getPerfumes();
  }

  createStore() {
    if (!this.newStore.nombre.trim() || !this.newStore.descripcion.trim() || !this.newStore.propietario.trim()) {
      alert('Please complete all fields');
      return;
    }
    this.sellerService.createStore(this.newStore);
    this.store = { ...this.newStore };
    this.showCreateStore = false;
  }

  addPerfume() {
    if (!this.newPerfume.nombre.trim() || !this.newPerfume.descripcion.trim() || 
        this.newPerfume.precio <= 0 || this.newPerfume.stock < 0 || this.newPerfume.tamano_ml <= 0) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }
    this.sellerService.addPerfume({
      nombre: this.newPerfume.nombre,
      descripcion: this.newPerfume.descripcion,
      precio: this.newPerfume.precio,
      stock: this.newPerfume.stock,
      tamano_ml: this.newPerfume.tamano_ml,
      genero: this.newPerfume.genero
    });
    this.newPerfume = {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      tamano_ml: 100,
      genero: ''
    };
    this.showAddForm = false;
  }

  deletePerfume(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este perfume?')) {
      this.sellerService.deletePerfume(id);
    }
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  toggleSelectPerfume(id: number) {
    if (this.selectedPerfumes.has(id)) {
      this.selectedPerfumes.delete(id);
    } else {
      this.selectedPerfumes.add(id);
    }
  }

  isSelected(id: number): boolean {
    return this.selectedPerfumes.has(id);
  }

  deleteSelectedPerfumes() {
    if (this.selectedPerfumes.size === 0) {
      alert('Please select at least one product to delete');
      return;
    }
    if (confirm(`Are you sure you want to delete ${this.selectedPerfumes.size} product(s)?`)) {
      this.selectedPerfumes.forEach(id => {
        this.sellerService.deletePerfume(id);
      });
      this.selectedPerfumes.clear();
    }
  }

  startEditPerfume(perfume: Perfume) {
    this.editingPerfume = { ...perfume };
  }

  saveEditPerfume() {
    if (!this.editingPerfume) return;
    if (!this.editingPerfume.nombre.trim() || !this.editingPerfume.descripcion.trim() || 
        this.editingPerfume.precio <= 0 || this.editingPerfume.stock < 0 || this.editingPerfume.tamano_ml <= 0) {
      alert('Please complete all fields correctly');
      return;
    }
    this.sellerService.updatePerfume(this.editingPerfume.id!, this.editingPerfume);
    this.editingPerfume = null;
  }

  cancelEditPerfume() {
    this.editingPerfume = null;
  }

  // Demo methods for testing notifications
  testCustomerInterest() {
    const customers = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez'];
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const product = this.perfumes[Math.floor(Math.random() * this.perfumes.length)];
    
    if (product) {
      this.notificationService.simulateCustomerInterest(customer, product.nombre);
    }
  }

  testCustomerPurchase() {
    const customers = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez'];
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const product = this.perfumes[Math.floor(Math.random() * this.perfumes.length)];
    
    if (product) {
      const amount = product.precio * Math.floor(Math.random() * 3 + 1);
      this.notificationService.simulateCustomerPurchase(customer, product.nombre, amount);
    }
  }

  testLowStock() {
    const product = this.perfumes[Math.floor(Math.random() * this.perfumes.length)];
    
    if (product) {
      this.notificationService.simulateLowStock(product.nombre, Math.floor(Math.random() * 5));
    }
  }

  onBackClick() {
    this.location.back();
  }

}
