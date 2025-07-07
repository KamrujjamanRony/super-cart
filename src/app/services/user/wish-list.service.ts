import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishListService {
  private wishlistUpdated = new BehaviorSubject<void>(undefined);
  wishlistUpdated$ = this.wishlistUpdated.asObservable();

  http = inject(HttpClient);

  apiUrl = 'http://supersoft:81/api/Wishlist';

  addWishlist(model: any | FormData): Observable<void> {
    console.log(model)
    return this.http.post<void>(this.apiUrl, model).pipe(
      tap(() => this.wishlistUpdated.next()) // Notify subscribers of Wishlist update
    );
  }

  getWishlist(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateWishlist(id: string, updateWishlistRequest: any | FormData): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, updateWishlistRequest,
      { responseType: 'text' }).pipe(
        tap(() => this.wishlistUpdated.next()) // Notify subscribers
      );
  }

  deleteWishlist(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.wishlistUpdated.next()) // Notify subscribers of Wishlist update
    );
  }
}
