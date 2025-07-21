import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthCookieService } from '../../../services/user/auth-cookie.service';
import { WishListService } from '../../../services/user/wish-list.service';
import { CartService } from '../../../services/user/cart.service';
import { ToastService } from '../../primeng/toast/toast.service';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  authCookieService = inject(AuthCookieService);
  wishListService = inject(WishListService);
  cartService = inject(CartService);
  private toastService = inject(ToastService);
  router = inject(Router);
  @Input() product: any;
  user = this.authCookieService.getUserData();

  // Function to generate an array of stars based on average rating
  getStarsArray(averageRating: number): boolean[] {
    const roundedRating = Math.round(averageRating * 2) / 2;
    return Array.from({ length: 5 }, (_, index) => index < roundedRating);
  }

  getViewLink(id: any) {
    return `/view/${id}`;
  }


  addToWishlist(product: any) {
    // const user = this.authCookieService.getUserData();

    const favoriteProduct = {
      id: crypto.randomUUID(),  // Generate a unique ID for the product
      productId: product.id
    };

    if (this.user?.uid) {
      this.wishListService.getWishlist(this.user.uid).subscribe({
        next: (wishlist) => {
          console.log(wishlist)
          if (wishlist.length > 0) {
            const restFavoriteProduct = wishlist[0];
            console.log(restFavoriteProduct)
            // If the wishlist exists, check if the product is already in the wishlist
            const existingProduct = restFavoriteProduct?.products?.find((p: any) => p.productId == favoriteProduct.productId);

            if (existingProduct) {
              this.toastService.showMessage('warn', 'Warning', 'Product already in the wish list!');
              console.log("Product already in the wish list");
              return;
            } else {
              // Add the new product to the wishlist
              restFavoriteProduct.products.push(favoriteProduct);
            }

            // Update the wishlist
            this.wishListService.updateWishlist(restFavoriteProduct.id, restFavoriteProduct).subscribe({
              next: () => {
                console.log('wishlist updated successfully');
                this.toastService.showMessage('success', 'Successful', 'Product successfully added to wishlist!');
              },
              error: (error) => {
                console.error('Error updating wishlist:', error);
                this.toastService.showMessage('error', 'Error', `${error.error.status || 'Error'} : ${error.error.message || error.error.title || 'Error creating wishlist'}`);
              }
            });
          } else {
            // If no wishlist exists, create a new wishlist for the user
            const newFavoriteProduct = {
              userId: this.user.uid,
              products: [favoriteProduct]
            };

            this.wishListService.addWishlist(newFavoriteProduct).subscribe({
              next: () => {
                this.toastService.showMessage('success', 'Successful', 'Product successfully added to wishlist!');
                // this.router.navigateByUrl('user/shopping-wishlist');
              },
              error: (error) => {
                this.toastService.showMessage('error', 'Error', `${error.error.status || 'Error'} : ${error.error.message || error.error.title || 'Error creating wishlist'}`);
              }
            });
          }
        },
        error: (error) => {
          this.toastService.showMessage('error', 'Error', `${error.error.status || 'Error'} : ${error.error.message || error.error.title || 'Error fetching wishlist'}`)
        }
      });
    } else {
      this.toastService.showMessage('warn', 'Warning', 'User not logged in!');
      console.error('User not logged in');
      this.router.navigateByUrl('login');
    }
  }

  addToCart(product: any) {
    const cartProduct = {
      id: crypto.randomUUID(),
      productId: product?.id,
      quantity: 1
    };

    if (this.user?.uid) {
      this.cartService.getCart(this.user.uid).subscribe({
        next: (cart) => {
          if (cart.length > 0) {
            // Get the first cart (assuming one cart per user)
            let userCart = { ...cart[0] };

            // Check if product exists in cart
            const existingProductIndex = userCart.products.findIndex(
              (p: any) => p.productId === cartProduct.productId
            );

            if (existingProductIndex !== -1) {
              // Product exists - increment quantity
              userCart.products[existingProductIndex].quantity += 1;
            } else {
              // Product doesn't exist - add new product
              userCart.products.push(cartProduct);
            }

            // Update the cart
            this.cartService.updateCart(userCart.id, userCart).subscribe({
              next: () => {
                console.log('Cart updated successfully');
                this.toastService.showMessage('success', 'Successful', 'Product successfully added to cart!');
                // Optionally: this.router.navigateByUrl('user/shopping-cart');
              },
              error: (error) => {
                console.error('Error updating cart:', error);
              }
            });
          } else {
            // No cart exists - create new cart
            const newCart = {
              userId: this.user.uid,
              products: [cartProduct]
            };

            this.cartService.addCart(newCart).subscribe({
              next: () => {
                console.log('New cart created successfully');
              },
              error: (error) => {
                console.error('Error creating cart:', error);
              }
            });
          }
        },
        error: (error) => {
          console.error('Error creating cart:', error);
        }
      });
    } else {
      console.error('User not logged in');
      this.toastService.showMessage('warn', 'Warning', 'User not logged in!');
      // Optionally redirect to login
    }
  }

}
