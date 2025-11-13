import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
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

// Interface CORREGIDA basada en la respuesta REAL de tu backend
export interface AuthResponse {
  token: string;
  usuario: {  // ← Cambiado de 'user' a 'usuario'
    id: number;
    nombre: string;      // ← Cambiado de 'name' a 'nombre'
    apellido: string;    // ← Cambiado de 'lastName' a 'apellido'
    email: string;
    rol: string;         // ← Cambiado de 'role' a 'rol'
    username: string;
    active: boolean;
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
        })
      );
  }

  register(registerData: RegisterRequest): Observable<AuthResponse> {
    // Asegurar que el role esté en mayúsculas como espera el backend
    const dataToSend = {
      ...registerData,
      role: registerData.role?.toUpperCase() || 'CLIENTE'
    };
    
    console.log('Enviando datos de registro:', dataToSend);
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, dataToSend)
      .pipe(
        tap(response => {
          console.log('Respuesta REAL del registro:', response);
          
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
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserData(): User | null {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
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
}