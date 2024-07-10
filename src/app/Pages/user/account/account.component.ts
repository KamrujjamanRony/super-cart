import { Component } from '@angular/core';
import { ProfileCardComponent } from "../../../components/Shared/profile-card/profile-card.component";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ProfileCardComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {

}
