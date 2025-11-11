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

    // Subscribe to notification updates
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadNotifications = count;
    });

    // Inicializar datos
    this.sellerService.initializeData();
  }

  loadPerfumes() {
    this.isLoading = true;
    this.sellerService.getPerfumes().subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading perfumes:', error);
        this.isLoading = false;
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
}