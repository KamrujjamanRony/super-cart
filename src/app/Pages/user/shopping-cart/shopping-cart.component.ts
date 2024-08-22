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

  ngOnInit() {
    this.cartService.getAllCarts().subscribe(data => {
      this.carts = data;
    });
  }

}
