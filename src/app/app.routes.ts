import { Routes } from '@angular/router';
import { MainComponent } from './Layouts/main/main.component';
import { HomeComponent } from './Pages/main/home/home.component';
import { ShopComponent } from './Pages/main/shop/shop.component';
import { AboutUsComponent } from './Pages/main/about-us/about-us.component';
import { CheckoutComponent } from './Pages/user/checkout/checkout.component';
import { ContactUsComponent } from './Pages/main/contact-us/contact-us.component';
import { LoginComponent } from './Pages/main/login/login.component';
import { ProfileInfoComponent } from './Pages/user/profile-info/profile-info.component';
import { WishlistComponent } from './Pages/user/wishlist/wishlist.component';
import { ShoppingCartComponent } from './Pages/user/shopping-cart/shopping-cart.component';
import { UserDashboardComponent } from './Layouts/user-dashboard/user-dashboard.component';
import { ProductViewComponent } from './Pages/main/product-view/product-view.component';
import { UserCheckoutComponent } from './Pages/user/user-checkout/user-checkout.component';
import { RegisterComponent } from './Pages/main/register/register.component';
import { AdminComponent } from './Layouts/admin/admin.component';
import { AdminListComponent } from './Pages/admin/admin-list/admin-list.component';
import { authGuard } from './services/admin/auth.guard';
import { ProductListComponent } from './Pages/admin/product-list/product-list.component';
import { AdminLoginComponent } from './Pages/admin/admin-login/admin-login.component';
import { MenuListComponent } from './Pages/admin/menu-list/menu-list.component';
import { userGuard } from './services/user/user.guard';
import { CategoryListComponent } from './Pages/admin/category-list/category-list.component';
import { WishListComponent } from './Pages/admin/wish-list/wish-list.component';
import { BrandListComponent } from './Pages/admin/brand-list/brand-list.component';
import { UserAddressComponent } from './Pages/user/user-address/user-address.component';
import { PasswordResetComponent } from './Pages/user/password-reset/password-reset.component';
import { OrderConfirmationComponent } from './Pages/user/order-confirmation/order-confirmation.component';
import { OrderListComponent } from './Pages/admin/order-list/order-list.component';

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
        component: ShopComponent
      },
      {
        path: 'shop/:category',
        component: ShopComponent
      },
      {
        path: 'about-us',
        component: AboutUsComponent
      },
      {
        path: 'checkout',
        component: CheckoutComponent
      },
      {
        path: 'contact-us',
        component: ContactUsComponent
      },
      {
        path: 'view/:id',
        component: ProductViewComponent
      },
      {
        path: 'user-checkout',
        component: UserCheckoutComponent
      },
      {
        path: 'order-confirmation',
        component: OrderConfirmationComponent,
        title: 'Order Confirmation'
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
        path: 'product-list',
        component: ProductListComponent, canActivate: [authGuard]
      },
      {
        path: 'order-list',
        component: OrderListComponent, canActivate: [authGuard]
      },
      {
        path: 'menu-list',
        component: MenuListComponent, canActivate: [authGuard]
      },
      {
        path: 'category-list',
        component: CategoryListComponent, canActivate: [authGuard]
      },
      {
        path: 'brand-list',
        component: BrandListComponent, canActivate: [authGuard]
      },
      {
        path: 'wish-list',
        component: WishListComponent, canActivate: [authGuard]
      },
    ]
  },
  {
    path: 'user',
    component: UserDashboardComponent,
    canActivate: [userGuard],
    children: [
      { path: '', redirectTo: 'profile-info', pathMatch: 'full' },
      {
        path: 'user-address',
        component: UserAddressComponent, canActivate: [userGuard]
      },
      {
        path: 'profile-info',
        component: ProfileInfoComponent, canActivate: [userGuard]
      },
      {
        path: 'wishlist',
        component: WishlistComponent, canActivate: [userGuard]
      },
      {
        path: 'shopping-cart',
        component: ShoppingCartComponent, canActivate: [userGuard]
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'change-password',
    component: PasswordResetComponent
  },
  {
    path: 'admin-login',
    component: AdminLoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];
