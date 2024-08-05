import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shop-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './shop-sidebar.component.html',
  styleUrl: './shop-sidebar.component.css'
})
export class ShopSidebarComponent {
  @Input() products: any;
  @Input() categories: any;
  @Input() brands: any;

  constructor() { }
}
