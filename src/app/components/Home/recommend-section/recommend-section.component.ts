import { Component, inject } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { ProductCardComponent } from "../../Shared/product-card/product-card.component";

@Component({
  selector: 'app-recommend-section',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './recommend-section.component.html',
  styleUrl: './recommend-section.component.css'
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

}
