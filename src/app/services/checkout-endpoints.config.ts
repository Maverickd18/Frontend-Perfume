/**
 * ============================================
 * CONFIGURACIÓN DE ENDPOINTS - CHECKOUT
 * ============================================
 * 
 * Este archivo centraliza todos los endpoints del módulo de checkout.
 * Modifica estos valores según tu API real.
 * 
 * IMPORTANTE: Este archivo es solo una referencia.
 * Los endpoints reales se configuran en:
 * src/app/services/checkout.service.ts
 */

export const CHECKOUT_ENDPOINTS_CONFIG = {
  /**
   * Base URL de la API
   * Se obtiene de environment.apiUrl automáticamente
   */
  // baseUrl: 'https://tienda-de-perfumes-2.onrender.com',

  /**
   * Endpoints para gestión de órdenes
   */
  orders: {
    // Procesar orden completa (crear + procesar pago)
    process: '/api/orders/process',
    
    // Crear orden sin procesar pago (útil para contraentrega)
    create: '/api/orders/create',
    
    // Obtener detalles de una orden
    getById: '/api/orders/:orderId',
    
    // Listar órdenes del usuario
    list: '/api/orders',
    
    // Cancelar orden
    cancel: '/api/orders/:orderId/cancel',
    
    // Actualizar estado de orden (solo admin)
    updateStatus: '/api/orders/:orderId/status'
  },

  /**
   * Endpoints para gestión de pagos
   */
  payments: {
    // Validar método de pago antes de procesar
    validate: '/api/payments/validate',
    
    // Confirmar pago de una orden existente
    confirm: '/api/payments/confirm',
    
    // Obtener métodos de pago disponibles
    getMethods: '/api/payments/methods',
    
    // Procesar reembolso
    refund: '/api/payments/:paymentId/refund',
    
    // Obtener detalles de pago
    getById: '/api/payments/:paymentId'
  },

  /**
   * Endpoints para cálculo de envío
   */
  shipping: {
    // Calcular costo de envío según dirección
    calculate: '/api/shipping/calculate',
    
    // Obtener métodos de envío disponibles
    getMethods: '/api/shipping/methods',
    
    // Validar código postal
    validatePostalCode: '/api/shipping/validate-postal-code',
    
    // Obtener tiempo estimado de entrega
    estimateDelivery: '/api/shipping/estimate'
  },

  /**
   * Endpoints adicionales útiles
   */
  extras: {
    // Validar cupón de descuento
    validateCoupon: '/api/coupons/validate',
    
    // Aplicar cupón a orden
    applyCoupon: '/api/orders/:orderId/apply-coupon',
    
    // Guardar dirección de envío para uso futuro
    saveAddress: '/api/users/addresses',
    
    // Obtener direcciones guardadas del usuario
    getAddresses: '/api/users/addresses',
    
    // Eliminar dirección guardada
    deleteAddress: '/api/users/addresses/:addressId'
  }
};

/**
 * ============================================
 * EJEMPLOS DE USO EN EL SERVICIO
 * ============================================
 */

// EJEMPLO 1: Procesar orden completa
// POST {{baseUrl}}/api/orders/process
// Body: CheckoutRequest
/*
{
  "shippingAddress": { ... },
  "paymentMethod": { ... },
  "items": [ ... ],
  "subtotal": 1999.98,
  "shipping": 50,
  "tax": 319.99,
  "total": 2369.97
}
*/

// EJEMPLO 2: Calcular envío
// POST {{baseUrl}}/api/shipping/calculate
// Body: ShippingAddress
/*
{
  "fullName": "Juan Pérez",
  "address": "Calle Principal #123",
  "city": "Ciudad de México",
  "postalCode": "12345",
  "phone": "5512345678",
  "email": "correo@ejemplo.com"
}
*/

// EJEMPLO 3: Validar método de pago
// POST {{baseUrl}}/api/payments/validate
// Body: PaymentMethod
/*
{
  "type": "card",
  "cardNumber": "4111111111111111",
  "cardHolderName": "JUAN PEREZ",
  "expirationDate": "12/25",
  "cvv": "123"
}
*/

/**
 * ============================================
 * CÓDIGOS DE RESPUESTA HTTP ESPERADOS
 * ============================================
 */
export const HTTP_STATUS_CODES = {
  // Éxito
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  // Errores del cliente
  BAD_REQUEST: 400,          // Datos inválidos
  UNAUTHORIZED: 401,         // No autenticado
  FORBIDDEN: 403,            // No autorizado
  NOT_FOUND: 404,            // Recurso no encontrado
  CONFLICT: 409,             // Conflicto (ej: orden ya procesada)
  UNPROCESSABLE: 422,        // Validación falló

  // Errores del servidor
  SERVER_ERROR: 500,         // Error interno
  SERVICE_UNAVAILABLE: 503   // Servicio no disponible
};

/**
 * ============================================
 * TIPOS DE ERRORES PERSONALIZADOS
 * ============================================
 */
export const ERROR_CODES = {
  // Errores de pago
  PAYMENT_DECLINED: 'PAYMENT_DECLINED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  INVALID_CARD: 'INVALID_CARD',
  EXPIRED_CARD: 'EXPIRED_CARD',
  PAYMENT_GATEWAY_ERROR: 'PAYMENT_GATEWAY_ERROR',

  // Errores de envío
  INVALID_POSTAL_CODE: 'INVALID_POSTAL_CODE',
  SHIPPING_NOT_AVAILABLE: 'SHIPPING_NOT_AVAILABLE',
  ADDRESS_VALIDATION_FAILED: 'ADDRESS_VALIDATION_FAILED',

  // Errores de orden
  EMPTY_CART: 'EMPTY_CART',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  PRICE_CHANGED: 'PRICE_CHANGED',
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  ORDER_ALREADY_PROCESSED: 'ORDER_ALREADY_PROCESSED',

  // Errores generales
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  SERVER_ERROR: 'SERVER_ERROR'
};

/**
 * ============================================
 * CONFIGURACIÓN DE TIMEOUT Y RETRY
 * ============================================
 */
export const REQUEST_CONFIG = {
  // Tiempo máximo de espera para requests (ms)
  timeout: 30000, // 30 segundos

  // Número de reintentos en caso de error
  maxRetries: 3,

  // Tiempo entre reintentos (ms)
  retryDelay: 1000, // 1 segundo

  // Endpoints que no deben reintentar (ej: crear orden)
  noRetryEndpoints: [
    '/api/orders/process',
    '/api/orders/create',
    '/api/payments/confirm'
  ]
};

/**
 * ============================================
 * HEADERS ADICIONALES (OPCIONAL)
 * ============================================
 */
export const CUSTOM_HEADERS = {
  // Identificador de la aplicación
  'X-App-Version': '1.0.0',
  
  // Tipo de cliente
  'X-Client-Type': 'web',
  
  // Idioma preferido
  'Accept-Language': 'es-MX'
};

/**
 * ============================================
 * NOTAS PARA EL DESARROLLADOR BACKEND
 * ============================================
 * 
 * 1. Todos los endpoints deben aceptar JSON en el body
 * 2. Todos los endpoints deben validar el token JWT
 * 3. Los endpoints deben retornar errores en formato:
 *    {
 *      "error": {
 *        "code": "ERROR_CODE",
 *        "message": "Mensaje descriptivo",
 *        "details": { ... }
 *      }
 *    }
 * 
 * 4. Los endpoints exitosos deben retornar:
 *    {
 *      "data": { ... },
 *      "message": "Mensaje de éxito"
 *    }
 * 
 * 5. Implementar rate limiting para prevenir abuso
 * 6. Loggear todas las transacciones de pago
 * 7. Implementar validación de precios en backend
 * 8. No confiar en datos del frontend (validar todo)
 */
