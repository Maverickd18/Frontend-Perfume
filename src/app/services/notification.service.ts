import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id?: number;
  tipo: 'interes' | 'compra' | 'mensaje' | 'stock_bajo';
  cliente: string;
  producto: string;
  mensaje: string;
  fecha: Date;
  leida: boolean;
  detalles?: any;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [];

  private notificationsSubject = new BehaviorSubject<Notification[]>(this.notifications);
  public notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(this.getUnreadCount());
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor() {
    this.updateUnreadCount();
    this.loadInitialNotifications();
  }

  private loadInitialNotifications(): void {
    // Agregar notificaciones de prueba
    this.addNotification({
      tipo: 'compra',
      cliente: 'María García',
      producto: 'Chanel No. 5',
      mensaje: 'María García compró 2 unidad(es) de Chanel No. 5 por $299.98',
      fecha: new Date(Date.now() - 1000 * 60 * 30), // Hace 30 minutos
      leida: false,
      detalles: { amount: 299.98, stock: 2 }
    });

    this.addNotification({
      tipo: 'compra',
      cliente: 'Carlos Rodríguez',
      producto: 'Dior Sauvage',
      mensaje: 'Carlos Rodríguez compró 1 unidad(es) de Dior Sauvage por $179.99',
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 2), // Hace 2 horas
      leida: false,
      detalles: { amount: 179.99, stock: 1 }
    });

    this.addNotification({
      tipo: 'interes',
      cliente: 'Ana López',
      producto: 'Versace Eros',
      mensaje: 'Ana López mostró interés en Versace Eros',
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 5), // Hace 5 horas
      leida: false
    });

    this.addNotification({
      tipo: 'compra',
      cliente: 'Juan Pérez',
      producto: 'Paco Rabanne 1 Million',
      mensaje: 'Juan Pérez compró 3 unidad(es) de Paco Rabanne 1 Million por $449.97',
      fecha: new Date(Date.now() - 1000 * 60 * 60 * 24), // Hace 1 día
      leida: true,
      detalles: { amount: 449.97, stock: 3 }
    });
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }

  addNotification(notification: Notification): void {
    notification.id = Math.max(...this.notifications.map(n => n.id || 0), 0) + 1;
    notification.fecha = new Date();
    notification.leida = false;
    this.notifications.unshift(notification);
    this.notificationsSubject.next([...this.notifications]);
    this.updateUnreadCount();
  }

  markAsRead(id: number): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.leida = true;
      this.notificationsSubject.next([...this.notifications]);
      this.updateUnreadCount();
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.leida = true);
    this.notificationsSubject.next([...this.notifications]);
    this.updateUnreadCount();
  }

  deleteNotification(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notificationsSubject.next([...this.notifications]);
    this.updateUnreadCount();
  }

  clearAllNotifications(): void {
    this.notifications = [];
    this.notificationsSubject.next([...this.notifications]);
    this.updateUnreadCount();
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.leida).length;
  }

  private updateUnreadCount(): void {
    this.unreadCountSubject.next(this.getUnreadCount());
  }

  simulateCustomerInterest(clienteName: string, productName: string): void {
    this.addNotification({
      tipo: 'interes',
      cliente: clienteName,
      producto: productName,
      mensaje: `${clienteName} mostró interés en ${productName}`,
      fecha: new Date(),
      leida: false
    });
  }

  simulateCustomerPurchase(clienteName: string, productName: string, amount: number, quantity: number = 1): void {
    this.addNotification({
      tipo: 'compra',
      cliente: clienteName,
      producto: productName,
      mensaje: `${clienteName} compró ${quantity} unidad(es) de ${productName} por $${amount}`,
      fecha: new Date(),
      leida: false,
      detalles: { amount, stock: quantity }
    });
  }

  simulateLowStock(productName: string, currentStock: number): void {
    this.addNotification({
      tipo: 'stock_bajo',
      cliente: 'Sistema',
      producto: productName,
      mensaje: `Stock bajo en ${productName}: solo ${currentStock} unidades`,
      fecha: new Date(),
      leida: false,
      detalles: { stock: currentStock }
    });
  }
}
