import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private baseUrl = environment.apiUrl;
  private favorites$ = new BehaviorSubject<any[]>([]);
  private favoriteCount$ = new BehaviorSubject<number>(0);

  constructor() {}

  getFavorites(): Observable<any[]> {
    return this.favorites$.asObservable();
  }

  getFavoriteCount(): Observable<number> {
    return this.favoriteCount$.asObservable();
  }

  addToFavorites(product: any): Observable<any> {
    return new Observable(observer => {
      observer.next({ success: true, message: 'Agregado a favoritos' });
      observer.complete();
    });
  }

  removeFromFavorites(productId: number): Observable<any> {
    return new Observable(observer => {
      observer.next({ success: true, message: 'Removido de favoritos' });
      observer.complete();
    });
  }

  isFavorited(productId: number): Observable<boolean> {
    return new Observable(observer => {
      observer.next(false);
      observer.complete();
    });
  }

  toggleFavorite(product: any): Observable<boolean> {
    return new Observable(observer => {
      observer.next(true);
      observer.complete();
    });
  }

  clearFavorites(): Observable<any> {
    return new Observable(observer => {
      observer.next({ success: true, message: 'Favoritos vaciados' });
      observer.complete();
    });
  }

  getUserFavorites(userId: number): Observable<any[]> {
    return new Observable(observer => {
      observer.next([]);
      observer.complete();
    });
  }
}
