# Frontend Perfume - Documentación de Integración Backend

## Estructura del Proyecto

El proyecto está estructurado con servicios independientes y listos para ser enlazados con un backend REST API.

### Servicios Disponibles

#### 1. **AuthService** (`services/auth.service.ts`)
Gestiona la autenticación de usuarios.

**Métodos:**
- `login(email: string, password: string): Observable<any>`
- `register(userData: any): Observable<any>`
- `logout(): void`
- `getCurrentUser(): Observable<any>`
- `isAuthenticated(): Observable<boolean>`
- `getToken(): string | null`

**Almacenamiento Local:**
- Token JWT en `localStorage['token']`
- Usuario en `localStorage['user']`

**Integración Backend:**
Reemplazar las URLs y lógica en:
```typescript
// Cambiar de:
setTimeout(() => { ... }, 500);

// A:
return this.http.post('http://tu-api.com/auth/login', { email, password })
  .pipe(
    tap(response => this.setUser(response))
  );
```

#### 2. **ProductService** (`services/product.service.ts`)
Gestiona productos y búsquedas.

**Métodos:**
- `getProducts(): Observable<any[]>` - Obtener todos los productos
- `getProductById(id: number): Observable<any>` - Obtener un producto por ID
- `searchProducts(query: string): Observable<any[]>` - Buscar productos
- `filterProducts(filters: any): Observable<any[]>` - Filtrar productos

**Integración Backend:**
```typescript
getProducts(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/products`);
}

getProductById(id: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/products/${id}`);
}
```

#### 3. **CartService** (`services/cart.service.ts`)
Gestiona el carrito de compras.

**Métodos:**
- `addToCart(product: any): void`
- `removeFromCart(productId: number): void`
- `updateQuantity(productId: number, quantity: number): void`
- `clearCart(): void`
- `getCartItems(): Observable<any[]>`
- `getCartCount(): Observable<number>`
- `getTotal(): number`

**Almacenamiento Local:**
- Carrito en `localStorage['cart']`

**Integración Backend:**
```typescript
addToCart(product: any): void {
  this.http.post(`${this.baseUrl}/cart`, { productId: product.id, quantity: 1 })
    .subscribe(response => {
      // Actualizar estado local
      this.loadCart();
    });
}

checkout(paymentInfo: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/orders`, {
    items: this.cartItems$.value,
    payment: paymentInfo
  });
}
```

#### 4. **FavoritesService** (`services/favorites.service.ts`)
Gestiona productos favoritos.

**Métodos:**
- `addToFavorites(product: any): void`
- `removeFromFavorites(productId: number): void`
- `isFavorited(productId: number): boolean`
- `toggleFavorite(product: any): boolean`
- `getFavorites(): Observable<any[]>`
- `clearFavorites(): void`

**Almacenamiento Local:**
- Favoritos en `localStorage['favorites']`

**Integración Backend:**
```typescript
addToFavorites(product: any): void {
  this.http.post(`${this.baseUrl}/favorites`, { productId: product.id })
    .subscribe(() => {
      const currentFavorites = this.favorites$.value;
      currentFavorites.push(product);
      this.favorites$.next(currentFavorites);
    });
}
```

## Configuración para Backend

### 1. Instalación de HttpClient

Asegúrate de que `HttpClientModule` esté importado en `app.module.ts`:

```typescript
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule,
    // ... otros imports
  ]
})
export class AppModule { }
```

### 2. Ejemplo de Servicio Backend

Aquí se muestra cómo integrar un servicio HTTP típico:

```typescript
// Ejemplo: Actualizar AuthService
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          this.setUser(response.user);
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(error);
        })
      );
  }
}
```

### 3. Interceptores de HTTP

Para agregar el token a todas las solicitudes, crea un interceptor:

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(req);
  }
}
```

Luego agrégalo a `app.module.ts`:

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class AppModule { }
```

## Endpoints API Esperados

### Autenticación
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Obtener usuario actual

### Productos
- `GET /api/products` - Obtener todos
- `GET /api/products/:id` - Obtener por ID
- `GET /api/products/search?q=query` - Buscar
- `GET /api/products/filter` - Filtrar (con query params)

### Carrito
- `GET /api/cart` - Obtener carrito
- `POST /api/cart` - Agregar al carrito
- `PUT /api/cart/:productId` - Actualizar cantidad
- `DELETE /api/cart/:productId` - Remover del carrito
- `POST /api/orders/checkout` - Procesar compra

### Favoritos
- `GET /api/favorites` - Obtener favoritos
- `POST /api/favorites` - Agregar a favoritos
- `DELETE /api/favorites/:productId` - Remover de favoritos

### Perfil
- `GET /api/users/:id` - Obtener perfil
- `PUT /api/users/:id` - Actualizar perfil
- `GET /api/users/:id/orders` - Obtener órdenes del usuario

## Variables de Entorno

Crear archivo `environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001/api',
  apiTimeout: 30000
};
```

Y `environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.tudominio.com',
  apiTimeout: 30000
};
```

## Uso en Componentes

Ejemplo de cómo usar los servicios en componentes:

```typescript
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

export class HomePage {
  products: any[] = [];
  cartCount: number = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });

    this.cartService.getCartCount().subscribe(count => {
      this.cartCount = count;
    });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
}
```

## Testing

Asegúrate de crear tests unitarios para los servicios:

```typescript
describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should add product to cart', (done) => {
    const product = { id: 1, title: 'Test', price: 10 };
    service.addToCart(product);
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(1);
      done();
    });
  });
});
```

## Notas Importantes

1. **localStorage**: Actualmente se usa para cache local. En producción, considera usar SessionStorage o sincronizar con el backend.

2. **Errores**: Implementa manejo de errores robusto con reintentos en los servicios.

3. **Seguridad**: 
   - Nunca guardes datos sensibles en localStorage sin encriptación
   - Valida todos los datos en el backend
   - Usa HTTPS en producción
   - Implementa CORS correctamente

4. **Estado**: Considera usar NgRx para estado compartido en aplicaciones más grandes.

5. **Base URL**: La URL base está configurada como `http://localhost:3000/api`. Cambia según tu backend.

## Licencia

Este proyecto está listo para ser integrado con cualquier backend REST API compatible.
