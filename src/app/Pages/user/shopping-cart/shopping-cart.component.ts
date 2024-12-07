import { Component, inject } from '@angular/core';
import { SingleCartComponent } from '../../../components/Shared/single-cart/single-cart.component';
import { CartService } from '../../../services/cart.service';
import { Auth } from '@angular/fire/auth';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [SingleCartComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent {
  cartService = inject(CartService);
  productService = inject(ProductService);
  private auth = inject(Auth);

  carts: any[] = [];
  products: any[] = [];
  user: any;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  ngOnInit() {
    this.auth.onAuthStateChanged((user) => {
      this.user = user;

      this.productService.getAllProducts().subscribe((productData) => {
        this.products = productData;

        this.cartService.getCart(this.user?.uid).subscribe((cartData) => {
          this.carts = this.mergeCartAndProducts(cartData[0]?.products || []);
          console.log(this.carts);
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
        id: cartItem.productId,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        selectColor: cartItem.selectColor,
        selectSize: cartItem.selectSize,
        productName: product?.name || 'Unknown',
        price: product?.offer_price || product?.regular_price || 0,
        image: product?.image || '',
        category: product?.category || 'Unknown',
        brand: product?.brand || 'Unknown',
      };
    });
  }

  calculateTotals() {
    this.totalPrice = this.carts.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    this.totalPrice = Math.round(this.totalPrice * 100) / 100; // Round to 2 decimal places

    this.totalQuantity = this.carts.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }

  updateCartAfterChange(updatedCarts: any) {
    this.carts = this.mergeCartAndProducts(updatedCarts);
    this.calculateTotals();
  }
}
