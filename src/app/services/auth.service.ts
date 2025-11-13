import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser$ = new BehaviorSubject<any>(null);
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private baseUrl = environment.apiUrl;

  constructor() {
    this.checkAuthStatus();
  }

  getCurrentUser(): Observable<any> {
    return this.currentUser$.asObservable();
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  login(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      observer.next({ success: true, token: 'token', user: { id: 1, email: email } });
      observer.complete();
    });
  }

  register(userData: any): Observable<any> {
    return new Observable(observer => {
      observer.next({ success: true, token: 'token', user: userData });
      observer.complete();
    });
  }

  logout(): Observable<any> {
    return new Observable(observer => {
      this.currentUser$.next(null);
      this.isAuthenticated$.next(false);
      observer.next({ success: true });
      observer.complete();
    });
  }

  getProfile(userId: number): Observable<any> {
    return new Observable(observer => {
      observer.next({ id: userId, email: '', name: '' });
      observer.complete();
    });
  }

  updateProfile(userId: number, data: any): Observable<any> {
    return new Observable(observer => {
      observer.next({ success: true, user: data });
      observer.complete();
    });
  }

  getToken(): string | null {
    return null;
  }

  private checkAuthStatus(): void {
  }
}
