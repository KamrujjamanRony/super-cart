import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { BreadcrumbsComponent } from '../../components/Shared/breadcrumbs/breadcrumbs.component';
import { HeaderComponent } from '../../components/Shared/header/header.component';
import { NavbarComponent } from '../../components/Shared/navbar/navbar.component';
import { FooterComponent } from '../../components/Shared/footer/footer.component';
import { CopyrightComponent } from '../../components/Shared/copyright/copyright.component';
import { UserSidebarComponent } from '../../components/Shared/user-sidebar/user-sidebar.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [RouterOutlet, BreadcrumbsComponent, HeaderComponent, NavbarComponent, FooterComponent, CopyrightComponent, UserSidebarComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {
  location = inject(Location);
  router = inject(Router);
  routePath!: any;

  constructor(){}

  ngOnInit(): void {
    this.updateRoutePath();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateRoutePath();
      }
    });
  }

  private updateRoutePath(): void {
    this.routePath = this.location.path().split('/').pop();
  }
}
