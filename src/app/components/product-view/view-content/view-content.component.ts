import { Component, Input } from '@angular/core';
import { RattingReviewsComponent } from "../ratting-reviews/ratting-reviews.component";

@Component({
  selector: 'app-view-content',
  imports: [RattingReviewsComponent],
  templateUrl: './view-content.component.html',
  styleUrl: './view-content.component.css'
})
export class ViewContentComponent {
  @Input() product: any;

}
