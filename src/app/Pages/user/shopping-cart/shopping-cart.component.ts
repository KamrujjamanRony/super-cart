import { Component } from '@angular/core';
import { SingleCartComponent } from '../../../components/Shared/single-cart/single-cart.component';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [SingleCartComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent {

}
