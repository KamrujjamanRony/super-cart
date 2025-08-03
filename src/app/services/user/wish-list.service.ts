import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishListService {
  private wishlistUpdated = new BehaviorSubject<void>(undefined);
  wishlistUpdated$ = this.wishlistUpdated.asObservable();

  http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Wishlist`;

  addWishlist(model: any | FormData): Observable<void> {
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
    return this.http.delete(`${this.apiUrl}/${id}`, {
      responseType: 'text' as const  // Use 'as const' to properly type the response
    }).pipe(
      tap(() => this.wishlistUpdated.next())
    );
  }

  clearWishlist(userId: string): any {
    // console.log(`Clearing Wishlist for user: ${userId}`);
    this.getWishlist(userId).subscribe(Wishlist => {
      if (Wishlist[0]) {
        // console.log('Current Wishlist:', Wishlist[0]);
        this.deleteWishlist(Wishlist[0].id).subscribe(data => {
          // console.log('Wishlist cleared successfully:', data);
          this.wishlistUpdated.next(); // Notify subscribers that the cart has been cleared
        });
      }
    });
  }
}
