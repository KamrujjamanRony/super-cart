import { Component, inject } from '@angular/core';
import { SingleCartComponent } from '../../../components/Shared/single-cart/single-cart.component';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [SingleCartComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent {
  cartService = inject(CartService);
  
  carts: any;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  ngOnInit() {
    this.cartService.getAllCarts().subscribe(data => {
      this.carts = data;
      this.calculateTotals(); // Calculate totals initially
    });
  }

  calculateTotals() {
    // Calculate the total price and round it to 2 decimal places as a number
    const total = this.carts.reduce((total: number, product: any) => {
      return total + (product.price * product.orderQuantity);
    }, 0);

    this.totalPrice = Math.round(total * 100) / 100; // Rounding to two decimal places

    // Calculate the total order quantity
    this.totalQuantity = this.carts.reduce((total: number, product: any) => {
      return total + product.orderQuantity;
    }, 0);
  }

  updateCartAfterChange(updatedCarts: any) {
    this.carts = updatedCarts;
    this.calculateTotals(); // Recalculate totals when the cart is updated
  }

}
