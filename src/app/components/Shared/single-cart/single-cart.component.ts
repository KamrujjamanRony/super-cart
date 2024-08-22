import { Component } from '@angular/core';

@Component({
  selector: 'app-single-cart',
  standalone: true,
  imports: [],
  templateUrl: './single-cart.component.html',
  styleUrl: './single-cart.component.css'
})
export class SingleCartComponent {
  count: any = 1;

  increase(){
    this.count++;
  }
  
  decrease(){
    this.count--;
  }

}
