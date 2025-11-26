import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
    username: string;
    active: boolean;
  };
}

export interface RegisterResponse {
  status: string;
  message: string;
  data: {
    id: number;
    email: string;
    name: string;
    lastName: string;
    role: string;
  };
}

export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: string;
  username: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          console.log('Respuesta REAL del login:', response);
          
          // Mapear la respuesta del backend (español) a nuestra interfaz (inglés)
          if (response.token && response.usuario) {
            const userData: User = {
              id: response.usuario.id,
              name: response.usuario.nombre,
              lastName: response.usuario.apellido,
              email: response.usuario.email,
              role: response.usuario.rol,
              username: response.usuario.username,
              active: response.usuario.active
            };
            
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userData', JSON.stringify(userData));
            
            console.log('Token guardado:', response.token);
            console.log('User data mapeado y guardado:', userData);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error en login:', error);
          let errorMessage = 'Error en el inicio de sesión';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.status === 401) {
            errorMessage = 'Credenciales inválidas';
          } else if (error.status === 403) {
            errorMessage = 'Acceso denegado';
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  register(registerData: RegisterRequest): Observable<RegisterResponse> {
    // Datos sin username - el backend generará el username automáticamente
    const dataToSend = {
      name: registerData.name,
      lastName: registerData.lastName,
      email: registerData.email,
      password: registerData.password,
      role: registerData.role?.toUpperCase() || 'CLIENTE'
    };
    
    console.log('Enviando datos de registro SIN username:', dataToSend);
    
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, dataToSend)
      .pipe(
        tap(response => {
          console.log('Respuesta del registro:', response);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error en registro:', error);
          let errorMessage = 'Error en el registro';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.status === 400) {
            errorMessage = 'Datos inválidos';
          } else if (error.status === 403) {
            errorMessage = 'Acceso denegado';
          } else if (error.status === 409) {
            errorMessage = 'El email ya está registrado';
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // ============= MÉTODOS DE VERIFICACIÓN DE CÓDIGO =============
  sendVerificationCode(email: string): Observable<any> {
    console.log('Enviando código de verificación a:', email);
    return this.http.post(`${this.apiUrl}/send-verification-code`, { email })
      .pipe(
        tap(response => {
          console.log('Código enviado exitosamente:', response);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error enviando código:', error);
          let errorMessage = 'Error al enviar el código de verificación';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.status === 400) {
            errorMessage = 'Email inválido';
          } else if (error.status === 409) {
            errorMessage = 'Email ya registrado';
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  verifyCode(email: string, code: string): Observable<any> {
    console.log('Verificando código para:', email);
    return this.http.post(`${this.apiUrl}/verify-code`, { email, code })
      .pipe(
        tap(response => {
          console.log('Código verificado exitosamente:', response);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error verificando código:', error);
          let errorMessage = 'Error al verificar el código';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.status === 400) {
            errorMessage = 'Código inválido o expirado';
          } else if (error.status === 401) {
            errorMessage = 'Código incorrecto';
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    console.log('Usuario cerró sesión');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserData(): User | null {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  isSeller(): boolean {
    const user = this.getUserData();
    return user ? user.role === 'VENDEDOR' : false;
  }

  isAdmin(): boolean {
    const user = this.getUserData();
    return user ? user.role === 'ADMIN' : false;
  }

  isClient(): boolean {
    const user = this.getUserData();
    return user ? user.role === 'CLIENTE' : false;
  }

  getCurrentUser(): User | null {
    return this.getUserData();
  }

  // Método para verificar el token de verificación
  verifyAccount(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify?token=${token}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error verificando cuenta:', error);
          let errorMessage = 'Error verificando la cuenta';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // Método para reenviar email de verificación
  resendVerificationEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-verification`, null, {
      params: { email }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error reenviando verificación:', error);
        let errorMessage = 'Error reenviando email de verificación';
        
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  // Agrega este método en tu auth.service.ts

/**
 * Solicitar restablecimiento de contraseña
 */
requestPasswordReset(email: string): Observable<any> {
  console.log('Solicitando recuperación de contraseña para:', email);
  
  return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email }).pipe(
    tap(response => {
      console.log('Respuesta de recuperación:', response);
    }),
    catchError(error => {
      console.error('Error en recuperación de contraseña:', error);
      return throwError(() => error);
    })
  );
}
}