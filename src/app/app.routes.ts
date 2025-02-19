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
import { authGuard } from './services/auth.guard';

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
        path: 'user',
        component: UserDashboardComponent,
        children: [
          { path: '', redirectTo: 'account', pathMatch: 'full' },
          {
            path: 'account',
            component: AccountComponent, canActivate: [authGuard]
          },
          {
            path: 'profile-info',
            component: ProfileInfoComponent, canActivate: [authGuard]
          },
          {
            path: 'wishlist',
            component: WishlistComponent, canActivate: [authGuard]
          },
          {
            path: 'shopping-cart',
            component: ShoppingCartComponent, canActivate: [authGuard]
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
