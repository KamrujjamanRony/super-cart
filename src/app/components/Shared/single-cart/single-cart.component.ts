import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CartService } from '../../../services/user/cart.service';
import { RouterLink } from '@angular/router';
import { AuthCookieService } from '../../../services/user/auth-cookie.service';
import { BdtPipe } from "../../../pipes/bdt.pipe";

@Component({
  selector: 'app-single-cart',
  imports: [RouterLink, BdtPipe],
  templateUrl: './single-cart.component.html',
  styleUrl: './single-cart.component.css'
})
export class SingleCartComponent {
  cartService = inject(CartService);
  authCookieService = inject(AuthCookieService);
  @Input() product: any;
  @Input() userCarts: any;
  @Output() cartUpdated = new EventEmitter<any>();
  count: number = 1;

  constructor() { }

  ngOnInit() {
    this.count = this.product.quantity;
  }

  // Common update function for both increase and decrease
  private updateQuantity(newQuantity: number) {
    // Ensure quantity doesn't go below 1
    newQuantity = Math.max(1, newQuantity);

    const updatedCart = {
      ...this.userCarts,
      products: this.userCarts.products.map((p: any) =>
        p.productId === this.product.productId ? { ...p, quantity: newQuantity } : p
      ),
    };

    this.cartService.updateCart(this.userCarts.id, updatedCart).subscribe({
      next: (response) => {
        // Update local state consistently
        this.count = newQuantity;
        this.product.quantity = newQuantity;
        this.cartUpdated.emit(updatedCart.products);
      },
      error: (error) => {
        console.error('Error updating cart quantity:', error);
        // Revert the count if there's an error
        this.count = this.product.quantity;
      }
    });
  }

  increase() {
    this.updateQuantity(this.count + 1);
  }

  decrease() {
    this.updateQuantity(this.count - 1);
  }

  getViewLink(id: any) {
    return `/view/${id}`;
  }

  deleteCart(selected: any) {
    if (this.userCarts) {
      const updatedCart = {
        ...this.userCarts,
        products: this.userCarts.products.filter((p: any) =>
          p.productId !== selected.productId // Use productId consistently
        ),
      };

      this.cartService.updateCart(this.userCarts.id, updatedCart).subscribe({
        next: (response) => {
          this.cartUpdated.emit(updatedCart.products);
        },
        error: (error) => {
          console.error('Error deleting cart:', error);
        }
      });
    }
  }



}
