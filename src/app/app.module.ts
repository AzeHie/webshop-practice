import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialsModule } from './angular-materials.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ErrorInterceptor } from './shared/interceptors/error-interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './shared/interceptors/auth-interceptor';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ShoppingcartComponent } from './shopping-cart/shopping-cart.component';
import { AboutusComponent } from './about-us/about-us.component';
import { ContactComponent } from './contact/contact.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ErrorComponent } from './error/error.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile/profile-edit/profile-edit.component';
import { ProfilePasswordComponent } from './profile/profile-password/profile-password.component';
import { EventDialogComponent } from './shared/event-dialog/event-dialog.component';
import { ProductModule } from './products/product.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { OrderModule } from './orders/order.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    ShoppingcartComponent,
    AboutusComponent,
    ContactComponent,
    SignupComponent,
    ErrorComponent,
    ProfileComponent,
    ProfileEditComponent,
    ProfilePasswordComponent,
    EventDialogComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ProductModule,
    OrderModule,
    SharedModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  // importing authInterceptor. multi: true tells angular, do not make a new one, just copy excisting one.
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent], // telling angular this component is going to be used, even angular doesn't "see it"
})
export class AppModule {}
