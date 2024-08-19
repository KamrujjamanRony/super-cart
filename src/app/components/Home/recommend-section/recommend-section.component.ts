import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ProductCardComponent } from "../../Shared/product-card/product-card.component";
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-recommend-section',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './recommend-section.component.html',
  styleUrl: './recommend-section.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RecommendSectionComponent {
  productService = inject(ProductService);
  
  products: any;
  ngOnInit() {
    this.productService.getAllProducts().subscribe(data => {
      this.products = data;
      console.log(this.products)
    });
  }

  breakpoints = {
    480: { slidesPerView: 1, spaceBetween: 5 },
    768: { slidesPerView: 2, spaceBetween: 10 },
    1024: { slidesPerView: 3, spaceBetween: 20 },
    1440: { slidesPerView: 4, spaceBetween: 25 }
  }

}
