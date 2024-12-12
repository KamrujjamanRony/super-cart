import { Component, inject } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { AuthCookieService } from '../../../services/auth-cookie.service';
import { Auth } from '@angular/fire/auth';
import { WishListService } from '../../../services/wish-list.service';

@Component({
    selector: 'app-wishlist',
    imports: [],
    templateUrl: './wishlist.component.html',
    styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
    wishListService = inject(WishListService);
    productService = inject(ProductService);
    authCookieService = inject(AuthCookieService);
    private auth = inject(Auth);
  
    wishlist: any[] = [];
    userWishlist: any[] = [];
    products: any[] = [];
    user: any;
    totalPrice: number = 0;
    totalQuantity: number = 0;
  
    ngOnInit() {
      this.loadWishlist();
  
      // Subscribe to Wishlist updates
      this.wishListService.wishlistUpdated$.subscribe(() => {
        this.loadWishlist(); // Refresh Wishlist whenever it updates
      });
    }
  
  
  
    loadWishlist() {
      this.auth.onAuthStateChanged((user) => {
        this.user = user;
  
        this.productService.getAllProducts().subscribe((productData) => {
          this.products = productData;
  
          this.wishListService.getWishlist(this.user?.uid).subscribe((cartData) => {
            if (!cartData) {
              return;
            }
            this.userWishlist = cartData[0];
            this.wishlist = this.mergeCartAndProducts(cartData[0]?.products || []);
            this.calculateTotals();
          });
        });
      });
    }
  
    // Merge cart items with product data
    mergeCartAndProducts(cartItems: any[]) {
      return cartItems.map((cartItem) => {
        const product = this.products.find((p) => p.id == cartItem.productId);
  
        return {
          id: cartItem.id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          selectColor: cartItem.selectColor,
          selectSize: cartItem.selectSize,
          date: cartItem.date,
          productName: product?.name || 'Unknown',
          price: product?.offer_price || product?.regular_price || 0,
          image: product?.image || '',
          category: product?.category || 'Unknown',
          brand: product?.brand || 'Unknown',
        };
      });
    }
  
    calculateTotals() {
      this.totalPrice = this.wishlist.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
  
      this.totalPrice = Math.round(this.totalPrice * 100) / 100; // Round to 2 decimal places
  
      this.totalQuantity = this.wishlist.reduce((total, item) => {
        return total + item.quantity;
      }, 0);
    }
  
    updateCartAfterChange(data: any) {
      this.wishlist = this.mergeCartAndProducts(data);
      this.calculateTotals();
    }

}
