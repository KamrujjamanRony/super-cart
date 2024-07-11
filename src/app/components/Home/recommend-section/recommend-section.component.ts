import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { ProductCardComponent } from "../../Shared/product-card/product-card.component";

@Component({
  selector: 'app-recommend-section',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './recommend-section.component.html',
  styleUrl: './recommend-section.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RecommendSectionComponent {
  dataService = inject(DataService);
  
  products: any;
  ngOnInit() {
    this.dataService.getJsonData().subscribe(data => {
      this.products = data.products;
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
