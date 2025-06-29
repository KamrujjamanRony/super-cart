import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-related-products',
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './related-products.component.html',
  styleUrl: './related-products.component.css'
})
export class RelatedProductsComponent {
  @Input() currentProduct: any;
  @Input() allProducts: any[] = [];

  get relatedProducts() {
    if (!this.currentProduct?.relatedProducts || !this.allProducts.length) {
      return [];
    }
    return this.allProducts.filter(product =>
      this.currentProduct.relatedProducts.includes(product.id) &&
      product.id !== this.currentProduct.id
    );
  }

}
