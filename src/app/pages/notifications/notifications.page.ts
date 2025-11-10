import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from '../../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: false
})
export class NotificationsPage implements OnInit {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  unreadCount = 0;
  selectedFilter = 'all'; // all, unread, interés, compra, stock_bajo

  filterOptions = [
    { value: 'all', label: 'Todas' },
    { value: 'unread', label: 'No leidas' },
    { value: 'interes', label: 'Interes' },
    { value: 'compra', label: 'Compras' },
    { value: 'stock_bajo', label: 'Stock bajo' }
  ];

  constructor(private notificationService: NotificationService, private router: Router) {}

  ngOnInit() {
    this.loadNotifications();
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
      this.applyFilter();
    });

    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
  }

  loadNotifications(): void {
    this.notifications = this.notificationService.getNotifications();
    this.applyFilter();
  }

  applyFilter(): void {
    switch (this.selectedFilter) {
      case 'unread':
        this.filteredNotifications = this.notifications.filter(n => !n.leida);
        break;
      case 'interes':
      case 'compra':
      case 'stock_bajo':
        this.filteredNotifications = this.notifications.filter(n => n.tipo === this.selectedFilter);
        break;
      case 'all':
      default:
        this.filteredNotifications = [...this.notifications];
    }
  }

  onFilterChange(filter: string): void {
    this.selectedFilter = filter;
    this.applyFilter();
  }

  markAsRead(notification: Notification): void {
    if (!notification.leida) {
      this.notificationService.markAsRead(notification.id!);
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  deleteNotification(id: number, event: any): void {
    event.stopPropagation();
    this.notificationService.deleteNotification(id);
  }

  clearAll(): void {
    if (confirm('¿Estás seguro de que deseas eliminar todas las notificaciones?')) {
      this.notificationService.clearAllNotifications();
    }
  }

  getNotificationIcon(tipo: string): string {
    switch (tipo) {
      case 'interes':
        return 'heart';
      case 'compra':
        return 'cart';
      case 'stock_bajo':
        return 'warning';
      case 'mensaje':
        return 'mail';
      default:
        return 'notifications';
    }
  }

  getNotificationColor(tipo: string): string {
    switch (tipo) {
      case 'interes':
        return 'danger';
      case 'compra':
        return 'success';
      case 'stock_bajo':
        return 'warning';
      case 'mensaje':
        return 'primary';
      default:
        return 'medium';
    }
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

  onBackClick() {
    this.router.navigate(['/seller']);
  }

  onHomeClick() {
    this.router.navigate(['/home']);
  }
}
