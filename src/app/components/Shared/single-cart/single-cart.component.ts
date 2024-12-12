import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthCookieService } from '../../../services/auth-cookie.service';

@Component({
    selector: 'app-single-cart',
    imports: [RouterLink],
    templateUrl: './single-cart.component.html',
    styleUrl: './single-cart.component.css'
})
export class SingleCartComponent {
  cartService = inject(CartService);
  authCookieService = inject(AuthCookieService);
  @Input() product: any;
  @Input() userCarts: any;
  @Output() cartUpdated = new EventEmitter<any>(); // Emit event to parent component
  count: any = 1;
  deleteCartSubscription?: Subscription;

  constructor() { }

  ngOnInit() {
    this.count = this.product.quantity;
  }

  // Update the product quantity and also update it in the carts array
  increase() {
    const updatedCart = {
      ...this.userCarts,
      products: this.userCarts.products.map((p: any) =>
        p.productId === this.product.productId ? { ...p, quantity: ++this.count } : p
      ),
    };

    this.cartService.updateCart(this.userCarts.id, updatedCart).subscribe({
      next: (response) => {
        // Find the updated product in the carts array and update it
        const index = this.userCarts.products.findIndex((p: any) => p.id === this.product.id);
        if (index !== -1) {
          this.userCarts.products[index].quantity = this.count;
        }
        this.cartUpdated.emit(this.userCarts.products);  // Emit the updated carts back to parent
      },
      error: (error) => {
        console.error('Error increasing cart quantity:', error);
      }
    });
  }

  decrease() {
    const updatedCart = {
      ...this.userCarts,
      products: this.userCarts.products.map((p: any) =>
        p.productId === this.product.productId ? { ...p, quantity: --this.count } : p
      ),
    };

    this.cartService.updateCart(this.userCarts.id, updatedCart).subscribe({
      next: (response) => {
        // Find the updated product in the carts array and update it
        const index = this.userCarts.products.findIndex((p: any) => p.id === this.product.id);
        if (index !== -1) {
          this.userCarts.products[index].quantity = this.count;
        }
        this.cartUpdated.emit(this.userCarts.products);  // Emit the updated carts back to parent
      },
      error: (error) => {
        console.error('Error decreasing cart quantity:', error);
      }
    });
  }

  getViewLink(id: any) {
    return `/view/${id}`;
  }

  deleteCart(selected: any) {
    const user = this.authCookieService.getUserData();
  
    if (!user) {
      console.error('User not logged in');
      return;
    }
  
    this.cartService.getCart(user.uid).subscribe({
      next: (cartArray) => {
        const cart = cartArray[0];
  
        if (cart) {
          const updatedCart = {
            ...this.userCarts,
            products: this.userCarts.products.filter((p: any) => p.id !== selected.id),
          };
  
          this.cartService.updateCart(cart.id, updatedCart).subscribe({
            next: (response) => {
              console.log('Cart deleted successfully');
              this.cartUpdated.emit(updatedCart.products); // Emit updated products array
            },
            error: (error) => {
              console.error('Error deleting cart:', error);
            },
            complete: () => {
              console.log('Delete cart operation completed');
            }
          });
        } else {
          console.log('No cart found to delete');
        }
      },
      error: (error) => {
        console.error('Error fetching user cart:', error);
      }
    });
  }
  
  

}
