import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock, faFolder, faHome } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  faLock = faLock;
  faFolder = faFolder;
  faHome = faHome;
  menu: any[] = [
    {
      title: 'Dashboard',
      icon: faFolder,
      link: '/admin/dashboard'
    },
    {
      title: 'Products',
      icon: faFolder,
      link: '/admin/product-list'
    },
    {
      title: 'Menu',
      icon: faFolder,
      link: '/admin/menu-list'
    },
    {
      title: 'Categories',
      icon: faFolder,
      link: '/admin/category-list'
    },
    {
      title: 'Brands',
      icon: faFolder,
      link: '/admin/brand-list'
    },
    {
      title: 'Orders',
      icon: faFolder,
      link: '/admin/order-list'
    },
    {
      title: 'Admins',
      icon: faLock,
      link: '/admin/admin-list'
    },
    {
      title: 'Home',
      icon: faHome,
      link: '/'
    }
  ];

}
