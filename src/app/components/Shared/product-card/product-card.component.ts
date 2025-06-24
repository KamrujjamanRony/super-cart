import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthCookieService } from '../../../services/user/auth-cookie.service';
import { WishListService } from '../../../services/wish-list.service';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product: any;
  authCookieService = inject(AuthCookieService);
  wishListService = inject(WishListService);

  // Function to generate an array of stars based on average rating
  getStarsArray(averageRating: number): boolean[] {
    const roundedRating = Math.round(averageRating * 2) / 2;
    return Array.from({ length: 5 }, (_, index) => index < roundedRating);
  }

  getViewLink(id: any) {
    return `/view/${id}`;
  }

  addToWishlist(product: any) {
    const user = this.authCookieService.getUserData();

    if (!user) {
      console.error('User not logged in');
      return;
    }

    const favoriteProduct = {
      id: crypto.randomUUID().toString(),
      productId: product.id
    };

    this.wishListService.getWishlist(user.uid).subscribe({
      next: (wishlist) => {
        console.log(wishlist)
        if (wishlist.length > 0) {
          const restFavoriteProduct = wishlist[0];
          // If the wishlist exists, check if the product is already in the wishlist
          const existingProduct = restFavoriteProduct.products.find((p: any) => p.productId === favoriteProduct.productId);

          if (existingProduct) {
            console.log("Product already in the wish list")
          } else {
            // Add the new product to the wishlist
            restFavoriteProduct.products.push(favoriteProduct);
          }

          // Update the wishlist
          this.wishListService.updateWishlist(restFavoriteProduct.id, restFavoriteProduct).subscribe({
            next: () => {
              console.log('wishlist updated successfully');
              // this.router.navigateByUrl('user/shopping-wishlist');
            },
            error: (error) => {
              console.error('Error updating wishlist:', error);
            }
          });
        } else {
          // If no wishlist exists, create a new wishlist for the user
          const newFavoriteProduct = {
            id: Date.now().toString(), // Generate a unique ID for the new wishlist
            userId: user.uid,
            products: [favoriteProduct]
          };

          this.wishListService.addWishlist(newFavoriteProduct).subscribe({
            next: () => {
              console.log('New wishlist created successfully');
              // this.router.navigateByUrl('user/shopping-wishlist');
            },
            error: (error) => {
              console.error('Error creating wishlist:', error);
            }
          });
        }
      },
      error: (error) => {
        console.error('Error fetching user wishlist:', error);
      }
    });
  }

}
