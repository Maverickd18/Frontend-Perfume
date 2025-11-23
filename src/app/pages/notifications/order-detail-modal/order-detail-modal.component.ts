import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

interface Order {
  id: number;
  orderNumber: string;
  cliente: string;
  producto: string;
  cantidad: number;
  total: number;
  estado: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
  fecha: Date;
  direccion?: string;
  telefono?: string;
}

@Component({
  selector: 'app-order-detail-modal',
  templateUrl: './order-detail-modal.component.html',
  styleUrls: ['./order-detail-modal.component.scss'],
  standalone: false
})
export class OrderDetailModalComponent {
  @Input() order!: Order;

  statusSteps: Array<{ key: 'pendiente' | 'procesando' | 'enviado' | 'entregado', label: string, icon: string }> = [
    { key: 'pendiente', label: 'Pedido Pendiente', icon: 'time-outline' },
    { key: 'procesando', label: 'En Proceso', icon: 'construct-outline' },
    { key: 'enviado', label: 'Enviado', icon: 'airplane-outline' },
    { key: 'entregado', label: 'Entregado', icon: 'checkmark-circle-outline' }
  ];

  constructor(private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss();
  }

  updateOrderStatus(newStatus: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado'): void {
    this.order.estado = newStatus;
    
    // Aquí iría la llamada al backend
    // this.orderService.updateOrderStatus(this.order.id, newStatus).subscribe(...)
    
    console.log(`Pedido ${this.order.orderNumber} actualizado a: ${newStatus}`);
  }

  cancelOrder(): void {
    if (confirm('¿Estás seguro de cancelar este pedido?')) {
      this.updateOrderStatus('cancelado');
      this.dismiss();
    }
  }

  getStatusColor(estado: string): string {
    switch (estado) {
      case 'pendiente':
        return 'warning';
      case 'procesando':
        return 'primary';
      case 'enviado':
        return 'secondary';
      case 'entregado':
        return 'success';
      case 'cancelado':
        return 'danger';
      default:
        return 'medium';
    }
  }

  getStatusLabel(estado: string): string {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'procesando':
        return 'En Proceso';
      case 'enviado':
        return 'Enviado';
      case 'entregado':
        return 'Entregado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return estado;
    }
  }

  isStatusCompleted(statusKey: string): boolean {
    const statusOrder = ['pendiente', 'procesando', 'enviado', 'entregado'];
    const currentIndex = statusOrder.indexOf(this.order.estado);
    const checkIndex = statusOrder.indexOf(statusKey);
    
    return checkIndex < currentIndex || this.order.estado === statusKey;
  }

  isStatusActive(statusKey: string): boolean {
    return this.order.estado === statusKey;
  }

  canUpdateToStatus(statusKey: string): boolean {
    if (this.order.estado === 'cancelado') return false;
    
    const statusOrder = ['pendiente', 'procesando', 'enviado', 'entregado'];
    const currentIndex = statusOrder.indexOf(this.order.estado);
    const targetIndex = statusOrder.indexOf(statusKey);
    
    // Solo puede avanzar al siguiente estado
    return targetIndex === currentIndex + 1;
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace unos segundos';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;

    return new Date(date).toLocaleDateString('es-ES');
  }
}
