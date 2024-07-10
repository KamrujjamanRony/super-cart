import { Component } from '@angular/core';
import { BreadcrumbsComponent } from "../../../components/Shared/breadcrumbs/breadcrumbs.component";

@Component({
  selector: 'app-user-checkout',
  standalone: true,
  imports: [BreadcrumbsComponent],
  templateUrl: './user-checkout.component.html',
  styleUrl: './user-checkout.component.css'
})
export class UserCheckoutComponent {

}
