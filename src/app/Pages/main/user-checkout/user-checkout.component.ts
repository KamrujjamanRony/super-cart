import { Component } from '@angular/core';
import { BreadcrumbsComponent } from "../../../components/Shared/breadcrumbs/breadcrumbs.component";
import { InputsComponent } from "../../../components/Shared/inputs/inputs.component";

@Component({
  selector: 'app-user-checkout',
  standalone: true,
  imports: [BreadcrumbsComponent, InputsComponent],
  templateUrl: './user-checkout.component.html',
  styleUrl: './user-checkout.component.css'
})
export class UserCheckoutComponent {
  inputValue1 = ""
  inputValue2 = ""

}
