import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  cartService = inject(CartService);
  router = inject(Router);
  @Input() product: any;

  constructor() { }

  // Function to generate an array of stars based on average rating
  getStarsArray(averageRating: number): boolean[] {
    const roundedRating = Math.round(averageRating * 2) / 2;
    return Array.from({ length: 5 }, (_, index) => index < roundedRating);
  }

  getViewLink(id: any) {
    return `/view/${id}`;
  }

  addToCart(product: any) {
    // Add product to the cart here
    console.log(`Added product ${product.name} to cart.`);
    this.cartService.addCart(product).subscribe({
      next: (response) => {
        this.router.navigateByUrl('user/shopping-cart');
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);
      }
    });
  }

}
