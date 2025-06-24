import { Routes } from '@angular/router';
import { MainComponent } from './Layouts/main/main.component';
import { HomeComponent } from './Pages/main/home/home.component';
import { ShopComponent } from './Pages/main/shop/shop.component';
import { AboutUsComponent } from './Pages/main/about-us/about-us.component';
import { AccountComponent } from './Pages/user/account/account.component';
import { CheckoutComponent } from './Pages/main/checkout/checkout.component';
import { ContactUsComponent } from './Pages/main/contact-us/contact-us.component';
import { LoginComponent } from './Pages/main/login/login.component';
import { ProfileInfoComponent } from './Pages/user/profile-info/profile-info.component';
import { WishlistComponent } from './Pages/user/wishlist/wishlist.component';
import { ShoppingCartComponent } from './Pages/user/shopping-cart/shopping-cart.component';
import { UserDashboardComponent } from './Layouts/user-dashboard/user-dashboard.component';
import { ProductViewComponent } from './Pages/main/product-view/product-view.component';
import { UserCheckoutComponent } from './Pages/main/user-checkout/user-checkout.component';
import { RegisterComponent } from './Pages/main/register/register.component';
import { AdminComponent } from './Layouts/admin/admin.component';
import { AdminListComponent } from './Pages/admin/admin-list/admin-list.component';
import { UserGuardService } from './services/user/user-guard.service';
import { authGuard } from './services/admin/auth.guard';
import { ProductListComponent } from './Pages/admin/product-list/product-list.component';
import { AdminFormComponent } from './Pages/admin/admin-form/admin-form.component';
import { ProductFormComponent } from './Pages/admin/product-form/product-form.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'shop',
        component: ShopComponent, canActivate: [authGuard]
      },
      {
        path: 'about-us',
        component: AboutUsComponent
      },
      {
        path: 'checkout',
        component: CheckoutComponent, canActivate: [authGuard]
      },
      {
        path: 'contact-us',
        component: ContactUsComponent
      },
      {
        path: 'view/:id',
        component: ProductViewComponent, canActivate: [authGuard]
      },
      {
        path: 'user-checkout',
        component: UserCheckoutComponent, canActivate: [authGuard]
      },
    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'admin-list', pathMatch: 'full' },
      {
        path: 'admin-list',
        component: AdminListComponent, canActivate: [authGuard]
      },
      {
        path: 'admin-form/add',
        component: AdminFormComponent, canActivate: [authGuard]
      },
      {
        path: 'admin-form/edit/:id',
        component: AdminFormComponent, canActivate: [authGuard]
      },
      {
        path: 'product-list',
        component: ProductListComponent, canActivate: [authGuard]
      },
      {
        path: 'product-form/add',
        component: ProductFormComponent, canActivate: [authGuard]
      },
      {
        path: 'product-form/edit/:id',
        component: ProductFormComponent, canActivate: [authGuard]
      },
    ]
  },
  {
    path: 'user',
    component: UserDashboardComponent,
    children: [
      { path: '', redirectTo: 'account', pathMatch: 'full' },
      {
        path: 'account',
        component: AccountComponent, canActivate: [UserGuardService]
      },
      {
        path: 'profile-info',
        component: ProfileInfoComponent, canActivate: [UserGuardService]
      },
      {
        path: 'wishlist',
        component: WishlistComponent, canActivate: [UserGuardService]
      },
      {
        path: 'shopping-cart',
        component: ShoppingCartComponent, canActivate: [UserGuardService]
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];
