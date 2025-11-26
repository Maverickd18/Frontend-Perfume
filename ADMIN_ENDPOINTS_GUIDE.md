# Guía de Endpoints del Panel de Admin

## Configuración del Backend

Los endpoints están configurados automáticamente usando la URL del `environment.ts`:

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://tienda-de-perfumes-2.onrender.com',
};
```

El servicio `AdminService` usa esta URL para todas las peticiones:
```typescript
private API_URL = `${environment.apiUrl}/api`;
```

---

## Endpoints Disponibles

### 1. GESTIÓN DE USUARIOS

#### Ver todos los usuarios
```typescript
this.adminService.getUsers(): Observable<User[]>
```
**Endpoint:** `GET /api/admin/users`

#### Buscar usuarios
```typescript
this.adminService.searchUsers(searchTerm: string): Observable<UserManagement[]>
```
**Endpoint:** `GET /api/admin/users?search=username`

#### Bloquear/Desbloquear usuario
```typescript
this.adminService.changeUserStatus(userId: number, enabled: boolean): Observable<any>
```
**Endpoint:** `PATCH /api/admin/users/{userId}/status`
**Body:** `{ "enabled": false }`

#### Cambiar rol de usuario
```typescript
this.adminService.changeUserRole(userId: number, role: string): Observable<any>
```
**Endpoint:** `PATCH /api/admin/users/{userId}/role`
**Body:** `{ "role": "VENDEDOR" }`

---

### 2. MODERACIÓN DE PERFUMES

#### Ver perfumes pendientes de aprobación
```typescript
this.adminService.getPendingPerfumes(page: number = 0, size: number = 20): Observable<any>
```
**Endpoint:** `GET /api/perfumes/admin/pendientes?page=0&size=20`

#### Ver todos los perfumes (incluyendo no aprobados)
```typescript
this.adminService.getAllPerfumesAdmin(page: number = 0, size: number = 20): Observable<any>
```
**Endpoint:** `GET /api/perfumes/admin?page=0&size=20`

#### Aprobar perfume
```typescript
this.adminService.approvePerfume(perfumeId: number): Observable<any>
```
**Endpoint:** `POST /api/perfumes/admin/{id}/aprobar`

#### Rechazar perfume
```typescript
this.adminService.rejectPerfume(perfumeId: number, motivo: string): Observable<any>
```
**Endpoint:** `POST /api/perfumes/admin/{id}/rechazar`
**Body:** `{ "motivo": "Precio no adecuado" }`

#### Ver estadísticas de moderación
```typescript
this.adminService.getModerationStats(): Observable<ModerationStats>
```
**Endpoint:** `GET /api/admin/moderation/stats`

---

### 3. GESTIÓN DE ÓRDENES

#### Ver todas las órdenes del sistema
```typescript
this.adminService.getOrders(): Observable<Order[]>
```
**Endpoint:** `GET /api/admin/orders?page=0&size=20`

#### Ver órdenes por estado
```typescript
this.adminService.getOrdersByStatus(status: string, page: number = 0, size: number = 20): Observable<any>
```
**Endpoint:** `GET /api/admin/orders?page=0&size=20&status=CONFIRMED`

#### Ver detalles de cualquier orden
```typescript
this.adminService.getOrderDetails(orderId: number): Observable<OrderManagement>
```
**Endpoint:** `GET /api/admin/orders/{orderId}`

#### Cancelar cualquier orden
```typescript
this.adminService.cancelOrder(orderId: number): Observable<any>
```
**Endpoint:** `POST /api/admin/orders/{orderId}/cancel`

#### Ver estadísticas de ventas
```typescript
this.adminService.getSalesStats(): Observable<any>
```
**Endpoint:** `GET /api/admin/sales/stats`

---

### 4. GESTIÓN DE MARCAS

#### Ver todas las marcas
```typescript
this.adminService.getBrands(): Observable<Brand[]>
```
**Endpoint:** `GET /api/brands/admin?page=0&size=20`

#### Crear marca
```typescript
this.adminService.createBrand(brand: Partial<Brand>): Observable<any>
```
**Endpoint:** `POST /api/brands`

#### Actualizar marca
```typescript
this.adminService.updateBrand(id: number, brand: Partial<Brand>): Observable<any>
```
**Endpoint:** `PUT /api/brands/{id}`

#### Eliminar marca
```typescript
this.adminService.deleteBrand(id: number): Observable<any>
```
**Endpoint:** `DELETE /api/brands/{id}`

---

### 5. GESTIÓN DE CATEGORÍAS

#### Ver todas las categorías
```typescript
this.adminService.getCategories(): Observable<Category[]>
```
**Endpoint:** `GET /api/categories/admin?page=0&size=20`

#### Crear categoría
```typescript
this.adminService.createCategory(category: Partial<Category>): Observable<any>
```
**Endpoint:** `POST /api/categories`

#### Actualizar categoría
```typescript
this.adminService.updateCategory(id: number, category: Partial<Category>): Observable<any>
```
**Endpoint:** `PUT /api/categories/{id}`

#### Eliminar categoría
```typescript
this.adminService.deleteCategory(id: number): Observable<any>
```
**Endpoint:** `DELETE /api/categories/{id}`

---

### 6. REPORTES Y ESTADÍSTICAS

#### Dashboard principal
```typescript
this.adminService.getDashboardStats(): Observable<DashboardStats>
```
**Endpoint:** `GET /api/admin/dashboard`

#### Reporte de ventas por período
```typescript
this.adminService.getSalesReport(startDate: string, endDate: string): Observable<SalesReport>
```
**Endpoint:** `GET /api/admin/reports/sales?startDate=2024-01-01&endDate=2024-01-31`

#### Top vendedores
```typescript
this.adminService.getTopSellers(): Observable<SellerReport[]>
```
**Endpoint:** `GET /api/admin/reports/top-sellers`

#### Productos más vendidos
```typescript
this.adminService.getTopProducts(): Observable<ProductReport[]>
```
**Endpoint:** `GET /api/admin/reports/top-products`

#### Usuarios más activos
```typescript
this.adminService.getActiveUsers(): Observable<UserActivityReport[]>
```
**Endpoint:** `GET /api/admin/reports/active-users`

---

### 7. SISTEMA Y CONFIGURACIÓN

#### Ver logs del sistema
```typescript
this.adminService.getSystemLogs(): Observable<any>
```
**Endpoint:** `GET /api/admin/system/logs`

#### Estadísticas del sistema
```typescript
this.adminService.getSystemStats(): Observable<SystemStats>
```
**Endpoint:** `GET /api/admin/system/stats`

#### Backup de datos
```typescript
this.adminService.createSystemBackup(): Observable<any>
```
**Endpoint:** `POST /api/admin/system/backup`

---

## Uso en el Componente

El componente `AdminPage` incluye todos los métodos necesarios para interactuar con estos endpoints:

```typescript
// En el componente admin.page.ts
export class AdminPage implements OnInit {
  constructor(private adminService: AdminService) {}

  // Cargar datos del dashboard
  loadDashboard() {
    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
      }
    });
  }

  // Cargar datos de moderación
  loadModerationData() {
    this.adminService.getModerationStats().subscribe({
      next: (stats) => {
        this.moderationStats = stats;
      }
    });
    
    this.adminService.getPendingPerfumes(0, 20).subscribe({
      next: (data) => {
        this.pendingPerfumes = data.content || data.data || data;
      }
    });
  }

  // Aprobar perfume
  approvePerfume(perfumeId: number) {
    this.adminService.approvePerfume(perfumeId).subscribe({
      next: () => {
        alert('Perfume aprobado correctamente');
        this.loadModerationData();
      }
    });
  }

  // Rechazar perfume
  rejectPerfume(perfumeId: number) {
    this.adminService.rejectPerfume(perfumeId, this.rejectionReason).subscribe({
      next: () => {
        alert('Perfume rechazado correctamente');
        this.loadModerationData();
      }
    });
  }
}
```

---

## Cambiar la URL del Backend

Para cambiar la URL del backend, simplemente modifica el archivo `environment.ts`:

```typescript
// Desarrollo (localhost)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
};

// Producción (servidor remoto)
export const environment = {
  production: true,
  apiUrl: 'https://tienda-de-perfumes-2.onrender.com',
};
```

---

## Autenticación

Todos los endpoints están protegidos y requieren un token JWT. El servicio incluye el token automáticamente en los headers:

```typescript
// El interceptor de autenticación agrega el token automáticamente
Authorization: Bearer {token}
```

El token se almacena en `localStorage` después del login:
```typescript
localStorage.setItem('adminToken', response.token);
```

---

## Manejo de Errores

Todos los métodos del servicio incluyen manejo de errores con `catchError`:

```typescript
this.adminService.getUsers().subscribe({
  next: (users) => {
    this.users = users;
  },
  error: (error) => {
    console.error('Error loading users:', error);
    // El servicio retorna un array vacío en caso de error
  }
});
```

---

## Notas Importantes

1. **Paginación**: Muchos endpoints soportan paginación con parámetros `page` y `size`
2. **Respuestas**: Las respuestas pueden tener diferentes estructuras (`data`, `content`, o directamente el array)
3. **Errores**: Se recomienda verificar la consola del navegador para debugging
4. **CORS**: Asegúrate de que el backend tenga CORS configurado correctamente

