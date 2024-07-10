import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { ProductCardComponent } from "../../Shared/product-card/product-card.component";

@Component({
  selector: 'app-product-wrapper',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './product-wrapper.component.html',
  styleUrl: './product-wrapper.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductWrapperComponent {
  dataService = inject(DataService);
  
  products: any;
  ngOnInit() {
    this.dataService.getJsonData().subscribe(data => {
      this.products = data.products;
      console.log(this.products)
    });
  }

}
