import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private baseUrl = environment.apiUrl;
  private favorites$ = new BehaviorSubject<any[]>([]);
  private favoriteCount$ = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {
    this.loadFavorites();
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  private loadFavorites(): void {
    this.getUserFavorites().subscribe({
      next: (favorites) => {
        this.favorites$.next(favorites);
        this.favoriteCount$.next(favorites.length);
      },
      error: (error) => {
        console.error('Error loading favorites:', error);
      }
    });
  }

  getFavorites(): Observable<any[]> {
    return this.favorites$.asObservable();
  }

  getFavoriteCount(): Observable<number> {
    return this.favoriteCount$.asObservable();
  }

  addToFavorites(perfumeId: number): Observable<any> {
    const url = `${this.baseUrl}/api/favorites/${perfumeId}`;
    const headers = this.getHeaders();

    return this.http.post(url, {}, { headers }).pipe(
      tap(() => {
        this.loadFavorites();
      })
    );
  }

  removeFromFavorites(perfumeId: number): Observable<any> {
    const url = `${this.baseUrl}/api/favorites/${perfumeId}`;
    const headers = this.getHeaders();

    return this.http.delete(url, { headers }).pipe(
      tap(() => {
        this.loadFavorites();
      })
    );
  }

  isFavorited(perfumeId: number): Observable<boolean> {
    const url = `${this.baseUrl}/api/favorites/${perfumeId}/is-favorite`;
    const headers = this.getHeaders();

    return this.http.get<{isFavorite: boolean}>(url, { headers }).pipe(
      map(response => response.isFavorite)
    );
  }

  toggleFavorite(product: any): Observable<boolean> {
    const perfumeId = product.id || product.perfumeId;
    
    return this.isFavorited(perfumeId).pipe(
      switchMap(isFavorited => {
        if (isFavorited) {
          return this.removeFromFavorites(perfumeId).pipe(map(() => false));
        } else {
          return this.addToFavorites(perfumeId).pipe(map(() => true));
        }
      })
    );
  }

  getUserFavorites(): Observable<any[]> {
    const url = `${this.baseUrl}/api/favorites`;
    const headers = this.getHeaders();

    return this.http.get<any>(url, { headers }).pipe(
      map(response => {
        if (response && response.status === 'success') {
          return response.data || [];
        }
        return [];
      })
    );
  }

  clearFavorites(): Observable<any> {
    return new Observable(observer => {
      this.favorites$.next([]);
      this.favoriteCount$.next(0);
      observer.next({ success: true, message: 'Favoritos vaciados' });
      observer.complete();
    });
  }
}