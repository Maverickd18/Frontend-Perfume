# Debugging Admin Panel

## Pasos para Debuguear

### 1. Revisar Consola del Navegador
Abre DevTools (F12) y busca los logs:

```
AdminService initialized with API_URL: https://tienda-de-perfumes-2.onrender.com/api
AdminPage component initialized
AdminPage ngOnInit - calling loadDashboard
loadDashboard called
Fetching dashboard stats from: https://tienda-de-perfumes-2.onrender.com/api/admin/dashboard
```

### 2. Verificar las Peticiones HTTP
En la pestaña "Network" de DevTools, busca las peticiones a:
- `/admin/dashboard`
- `/brands`
- `/admin/reports/top-sellers`
- `/admin/reports/active-users`

Verifica que:
- El status sea 200 (exitoso)
- El servidor responda en menos de 3 segundos
- Los datos estén en formato JSON

### 3. Problemas Comunes

#### Problema: "Se queda cargando"
- **Causa**: El servidor no responde a tiempo (>3 segundos)
- **Solución**: 
  - Verificar que el backend esté corriendo
  - Verificar que la URL en `environment.ts` sea correcta
  - Verificar que CORS está habilitado en el backend

#### Problema: "No se cargan datos"
- **Causa**: Los endpoints no existen o devuelven error 404
- **Solución**:
  - Verificar los endpoints en el backend
  - Revisar los logs del backend
  - Comprobar que la autenticación es correcta (token JWT)

#### Problema: "Datos vacíos"
- **Causa**: El backend devuelve datos pero con estructura diferente
- **Solución**:
  - Revisar en Network > Response qué estructura tiene
  - Actualizar el mapeo en los métodos del componente

### 4. URLs Configuradas

**Desarrollo:**
```
https://tienda-de-perfumes-2.onrender.com/api
```

**Para cambiar:**
Edita `src/environments/environment.ts`

### 5. Métodos Disponibles

El componente tiene logs en estos métodos:
- `loadDashboard()` - Carga principal
- `loadTopBrands()` - Marcas principales
- `loadTopSellers()` - Vendedores top
- `loadTopCustomers()` - Clientes activos

### 6. Timeout Configurado

El spinner desaparece después de **3 segundos** automáticamente.
Si necesitas más tiempo:
- Busca `setTimeout` en `loadDashboard()`
- Cambia `3000` a más milisegundos

### 7. Manejo de Errores

Si un endpoint falla:
- Se muestra el error en consola
- El array se inicializa como vacío `[]`
- La UI no muestra datos pero tampoco bloquea

### 8. Verificar Autenticación

En consola:
```javascript
localStorage.getItem('adminToken')
localStorage.getItem('currentUser')
```

Si son `null`, el usuario no está autenticado.

