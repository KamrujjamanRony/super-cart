import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card-2',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-card-2.component.html',
  styleUrl: './product-card-2.component.css'
})
export class ProductCard2Component {
  @Input() product: any;

  constructor() { }

  getViewLink(id: any) {
    return `/view/${id}`;
  }

}
