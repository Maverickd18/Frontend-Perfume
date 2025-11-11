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

export interface AuthResponse {
  token: string;
  usuario: {
    id: number;
    name: string;
    apellido: string;
    email: string;
    rol: string;
  };
}

export interface User {
  id: number;
  name: string;
  apellido: string;
  email: string;
  rol: string;
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
          console.log('Respuesta del servidor en AuthService:', response);
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userData', JSON.stringify(response.usuario));
        })
      );
  }

  register(registerData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerData)
      .pipe(
        tap(response => {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userData', JSON.stringify(response.usuario));
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
    return user ? user.rol === 'VENDEDOR' || user.rol === 'vendedor' : false;
  }

  isAdmin(): boolean {
    const user = this.getUserData();
    return user ? user.rol === 'ADMIN' || user.rol === 'admin' : false;
  }

  getCurrentUser(): User | null {
    return this.getUserData();
  }
}