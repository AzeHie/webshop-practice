import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutusComponent } from './about-us/about-us.component';
import { AuthGuard } from './auth/auth-guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ContactComponent } from './contact/contact.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileEditComponent } from './profile/profile-edit/profile-edit.component';
import { ProfilePasswordComponent } from './profile/profile-password/profile-password.component';
import { ProfileComponent } from './profile/profile.component';
import { ShoppingcartComponent } from './shopping-cart/shopping-cart.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'cart', component: ShoppingcartComponent },
  { path: 'about', component: AboutusComponent },
  { path: 'contact', component: ContactComponent },
  {
    path: 'orders',
    loadChildren: () =>
      import('./orders/order.module').then((x) => x.OrderModule),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./products/product.module').then((x) => x.ProductModule),
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'profile/edit',
    component: ProfileEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/changepassword',
    component: ProfilePasswordComponent,
    canActivate: [AuthGuard],
  },
  { path: 'not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/not-found' }, // wildcard route, catch all routes which do not exist.
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
