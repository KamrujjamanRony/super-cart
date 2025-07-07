import { Auth } from '@angular/fire/auth';
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/user/cart.service';
import { WishListService } from '../../../services/user/wish-list.service';
import { AuthService } from '../../../services/user/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
  wishListService = inject(WishListService);
  private auth = inject(Auth);
  private cdr = inject(ChangeDetectorRef);
  menuList = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Contact Us', path: '/contact-us' },
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/register' },
    { name: 'Cart', path: '/cart' },
    { name: 'Wishlist', path: '/wish-list' }
  ]

  totalCarts = signal<number>(0);
  totalWishlists = signal<number>(0);
  user: any;
  category: string = 'all';

  ngOnInit() {
    this.auth.onAuthStateChanged((user) => {
      this.user = user;
      if (this.user?.uid) {
        this.fetchUserCart();
        this.fetchWishList();
      }
    });

    // Listen for cart updates
    this.cartService.cartUpdated$.subscribe(() => {
      this.fetchUserCart();
    });

    // Listen for wishlist updates
    this.wishListService.wishlistUpdated$.subscribe(() => {
      this.fetchWishList();
    });
  }

  fetchUserCart() {
    if (!this.user?.uid) {
      this.totalCarts.set(0);
      return;
    }
    this.cartService.getCart(this.user?.uid).subscribe(data => {
      this.totalCarts.set(data?.length > 0 ? data[0].products.reduce((sum: number, p: { quantity: any; }) => sum + p.quantity, 0) : 0);
      this.cdr.detectChanges();
    });
  }

  fetchWishList() {
    if (!this.user?.uid) {
      this.totalWishlists.set(0);
      return;
    }
    this.wishListService.getWishlist(this.user?.uid).subscribe(data => {
      this.totalWishlists.set(data?.length > 0 ? data[0].products.length : 0);
      this.cdr.detectChanges();
    });
  }

  logout() {
    this.authService.logout();
  }

}
