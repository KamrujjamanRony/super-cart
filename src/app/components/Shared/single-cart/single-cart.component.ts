import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-single-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './single-cart.component.html',
  styleUrl: './single-cart.component.css'
})
export class SingleCartComponent {
  cartService = inject(CartService);
  @Input() product: any;
  @Input() carts: any;
  @Output() cartUpdated = new EventEmitter<any>(); // Emit event to parent component
  count: any = 1;
  deleteCartSubscription?: Subscription;

  constructor() { }

  ngOnInit() {
    this.count = this.product.orderQuantity;
  }

  // Update the product quantity and also update it in the carts array
  increase() {
    const updatedProduct = { ...this.product, orderQuantity: ++this.count };

    this.cartService.updateCart(this.product.id, updatedProduct).subscribe({
      next: (response) => {
        // Find the updated product in the carts array and update it
        const index = this.carts.findIndex((p: any) => p.id === this.product.id);
        if (index !== -1) {
          this.carts[index].orderQuantity = this.count;
        }
        this.cartUpdated.emit(this.carts);  // Emit the updated carts back to parent
      },
      error: (error) => {
        console.error('Error increasing cart quantity:', error);
      }
    });
  }

  decrease() {
    const updatedProduct = { ...this.product, orderQuantity: --this.count };

    this.cartService.updateCart(this.product.id, updatedProduct).subscribe({
      next: (response) => {
        // Find the updated product in the carts array and update it
        const index = this.carts.findIndex((p: any) => p.id === this.product.id);
        if (index !== -1) {
          this.carts[index].orderQuantity = this.count;
        }
        this.cartUpdated.emit(this.carts);  // Emit the updated carts back to parent
      },
      error: (error) => {
        console.error('Error decreasing cart quantity:', error);
      }
    });
  }

  getViewLink(id: any) {
    return `/view/${id}`;
  }

  deleteCart() {
    this.deleteCartSubscription = this.cartService.deleteCart(this.product.id).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error('Error to delete cart:', error);
      }
    });
    this.deleteCartSubscription.unsubscribe();
    window.location.reload(); // Reload the page to reflect the updated cart after deletion
  }

}
