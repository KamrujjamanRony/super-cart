import { Auth } from '@angular/fire/auth';
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
  private auth = inject(Auth);
  private cdr = inject(ChangeDetectorRef);
  
  totalCarts = signal<number>(0);
  user: any;

  ngOnInit() {
    this.auth.onAuthStateChanged((user) => {
      this.user = user;
      this.fetchUserCart();
    });

    // Listen for cart updates
    this.cartService.cartUpdated$.subscribe(() => {
      this.fetchUserCart();
    });
  }

  fetchUserCart() {
    this.cartService.getAllCarts().subscribe(data => {
      const userCart = data.find(c => c.userId === this.user?.uid);
      this.totalCarts.set(userCart ? userCart.products.reduce((sum: any, p: { quantity: any; }) => sum + p.quantity, 0) : 0);
      this.cdr.detectChanges();
    });
  }

  logout() {
    this.authService.logout();
  }

}
