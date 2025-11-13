import { Component, OnInit } from '@angular/core';
import { SellerService, Perfume } from '../../services/seller.service';
import { NotificationService } from '../../services/notification.service';
import { StepperService } from '../../services/stepper.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.page.html',
  styleUrls: ['./seller.page.scss'],
  standalone: false
})
export class SellerPage implements OnInit {

  perfumes: Perfume[] = [];
  selectedPerfumes: Set<number> = new Set();
  unreadNotifications = 0;
  
  editingPerfume: Perfume | null = null;
  isLoading = false;
  currentPage = 0;
  pageSize = 50;

  constructor(
    private sellerService: SellerService, 
    private notificationService: NotificationService,
    private stepperService: StepperService,
    private router: Router, 
    private location: Location
  ) {}

  ngOnInit() {
    this.loadPerfumes();
    
    this.sellerService.perfumes$.subscribe(perfumes => {
      this.perfumes = perfumes;
    });

    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadNotifications = count;
    });

    this.sellerService.initializeData();
  }

  loadPerfumes() {
    this.isLoading = true;
    this.sellerService.getMyPerfumes(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Perfumes loaded successfully');
      },
      error: (error) => {
        console.error('Error loading perfumes:', error);
        this.isLoading = false;
        alert('Error loading perfumes: ' + error.message);
      }
    });
  }

  openAddProductStepper() {
    this.stepperService.openStepper();
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
      const deletePromises = Array.from(this.selectedPerfumes).map(id => 
        this.sellerService.deletePerfume(id).toPromise()
      );

      Promise.all(deletePromises).then(() => {
        this.selectedPerfumes.clear();
        this.loadPerfumes(); // Recargar la lista
      }).catch(error => {
        console.error('Error deleting perfumes:', error);
        alert('Error deleting some products. Please try again.');
      });
    }
  }

  startEditPerfume(perfume: Perfume) {
    this.editingPerfume = { ...perfume };
  }

  saveEditPerfume() {
    if (!this.editingPerfume || !this.editingPerfume.id) return;
    
    if (!this.editingPerfume.name.trim() || !this.editingPerfume.description.trim() || 
        this.editingPerfume.price <= 0 || this.editingPerfume.stock < 0 || this.editingPerfume.sizeMl <= 0) {
      alert('Please complete all fields correctly');
      return;
    }

    this.sellerService.updatePerfume(this.editingPerfume.id, this.editingPerfume).subscribe({
      next: () => {
        this.editingPerfume = null;
        this.loadPerfumes(); // Recargar la lista
      },
      error: (error) => {
        console.error('Error updating perfume:', error);
        alert('Error updating product. Please try again.');
      }
    });
  }

  cancelEditPerfume() {
    this.editingPerfume = null;
  }

  deletePerfume(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.sellerService.deletePerfume(id).subscribe({
        next: () => {
          this.loadPerfumes(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error deleting perfume:', error);
          alert('Error deleting product. Please try again.');
        }
      });
    }
  }

  onBackClick() {
    this.location.back();
  }

  // Método para obtener la imagen del perfume
  getPerfumeImage(perfume: Perfume): string {
    if (perfume.imageUrl && perfume.imageUrl !== '/uploads/default-perfume.jpg') {
      return `http://localhost:8080/uploads/${perfume.imageUrl}`;
    }
    return 'assets/images/default-perfume.jpg';
  }

  // Método para obtener la imagen de la marca
  getBrandImage(brand: any): string {
    if (brand.imageUrl && brand.imageUrl !== '/uploads/default-brand.jpg') {
      return `http://localhost:8080/uploads/${brand.imageUrl}`;
    }
    return 'assets/images/default-brand.jpg';
  }
}