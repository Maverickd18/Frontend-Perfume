import { Injectable } from '@angular/core';

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeUsers: number;
  pendingStores: number;
  pendingOrders: number;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  estado: 'activo' | 'bloqueado' | 'pendiente';
  tipoUsuario: 'cliente' | 'vendedor' | 'admin';
  fechaRegistro: string;
  tienda?: string;
  ordenes: number;
}

export interface Store {
  id: number;
  nombre: string;
  propietario: string;
  email: string;
  telefono: string;
  descripcion: string;
  estado: 'verificada' | 'pendiente' | 'suspendida';
  productosActivos: number;
  ventasMes: number;
  calificacion: number;
  fechaCreacion: string;
}

export interface Order {
  id: number;
  numero: string;
  cliente: string;
  tienda: string;
  total: number;
  estado: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
  fecha: string;
  productos: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  // Mock data - Usuarios
  private users: User[] = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '+34 666 123 456',
      estado: 'activo',
      tipoUsuario: 'vendedor',
      fechaRegistro: '2025-01-15',
      tienda: 'Perfumes Premium',
      ordenes: 45
    },
    {
      id: 2,
      nombre: 'María García',
      email: 'maria@example.com',
      telefono: '+34 666 234 567',
      estado: 'activo',
      tipoUsuario: 'cliente',
      fechaRegistro: '2025-01-20',
      ordenes: 12
    },
    {
      id: 3,
      nombre: 'Carlos López',
      email: 'carlos@example.com',
      telefono: '+34 666 345 678',
      estado: 'bloqueado',
      tipoUsuario: 'vendedor',
      fechaRegistro: '2025-02-01',
      tienda: 'Aromas del Mundo',
      ordenes: 3
    },
    {
      id: 4,
      nombre: 'Ana Martínez',
      email: 'ana@example.com',
      telefono: '+34 666 456 789',
      estado: 'activo',
      tipoUsuario: 'cliente',
      fechaRegistro: '2025-02-10',
      ordenes: 28
    }
  ];

  // Mock data - Tiendas
  private stores: Store[] = [
    {
      id: 1,
      nombre: 'Perfumes Premium',
      propietario: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '+34 666 123 456',
      descripcion: 'Tienda de perfumes de lujo importados',
      estado: 'verificada',
      productosActivos: 45,
      ventasMes: 15000,
      calificacion: 4.8,
      fechaCreacion: '2025-01-15'
    },
    {
      id: 2,
      nombre: 'Aromas Naturales',
      propietario: 'Laura Fernández',
      email: 'laura@example.com',
      telefono: '+34 666 567 890',
      descripcion: 'Perfumes y colonias naturales',
      estado: 'pendiente',
      productosActivos: 23,
      ventasMes: 5000,
      calificacion: 0,
      fechaCreacion: '2025-02-20'
    },
    {
      id: 3,
      nombre: 'Fragancias del Mundo',
      propietario: 'Miguel Sánchez',
      email: 'miguel@example.com',
      telefono: '+34 666 678 901',
      descripcion: 'Colección de fragancias internacionales',
      estado: 'verificada',
      productosActivos: 67,
      ventasMes: 22000,
      calificacion: 4.9,
      fechaCreacion: '2025-01-05'
    }
  ];

  // Mock data - Pedidos
  private orders: Order[] = [
    {
      id: 1,
      numero: 'ORD-001',
      cliente: 'María García',
      tienda: 'Perfumes Premium',
      total: 250.50,
      estado: 'entregado',
      fecha: '2025-03-01',
      productos: 2
    },
    {
      id: 2,
      numero: 'ORD-002',
      cliente: 'Ana Martínez',
      tienda: 'Fragancias del Mundo',
      total: 180.00,
      estado: 'enviado',
      fecha: '2025-03-02',
      productos: 1
    },
    {
      id: 3,
      numero: 'ORD-003',
      cliente: 'Carlos López',
      tienda: 'Aromas Naturales',
      total: 95.99,
      estado: 'procesando',
      fecha: '2025-03-03',
      productos: 3
    },
    {
      id: 4,
      numero: 'ORD-004',
      cliente: 'Juan Pérez',
      tienda: 'Perfumes Premium',
      total: 320.00,
      estado: 'pendiente',
      fecha: '2025-03-04',
      productos: 2
    }
  ];

  constructor() { }

  // ============= DASHBOARD =============
  getDashboardStats(): DashboardStats {
    return {
      totalUsers: this.users.length,
      totalStores: this.stores.length,
      totalOrders: this.orders.length,
      totalRevenue: 87250.50,
      monthlyRevenue: 42500.75,
      activeUsers: this.users.filter(u => u.estado === 'activo').length,
      pendingStores: this.stores.filter(s => s.estado === 'pendiente').length,
      pendingOrders: this.orders.filter(o => o.estado === 'pendiente').length
    };
  }

  // ============= USERS =============
  getUsers(): User[] {
    return this.users;
  }

  banUser(userId: number): void {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.estado = 'bloqueado';
    }
  }

  unbanUser(userId: number): void {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.estado = 'activo';
    }
  }

  // ============= STORES =============
  getStores(): Store[] {
    return this.stores;
  }

  verifyStore(storeId: number): void {
    const store = this.stores.find(s => s.id === storeId);
    if (store) {
      store.estado = 'verificada';
    }
  }

  suspendStore(storeId: number): void {
    const store = this.stores.find(s => s.id === storeId);
    if (store) {
      store.estado = 'suspendida';
    }
  }

  // ============= ORDERS =============
  getOrders(): Order[] {
    return this.orders;
  }

  updateOrderStatus(orderId: number, newStatus: string): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.estado = newStatus as any;
    }
  }

  // ============= PRODUCTS =============
  deleteProduct(productId: number): void {
    // Mock implementation
    console.log(`Producto ${productId} eliminado`);
  }

}
