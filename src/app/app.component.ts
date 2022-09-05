import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ShoppingCartService } from './services/shopping-cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  title = 'azesshop';
  isAuthed = false;

  constructor(
    private authService: AuthService,
    private shoppingcartService: ShoppingCartService
  ) {}

  ngOnInit(): void {
    this.authService.autoLogin();
    this.isAuthed = this.authService.getIsAuthed();
    this.shoppingcartService.loadCartData(this.isAuthed);
  }

  onActivate(event) {
    // scroll on page load
    if (
      event.constructor.name === 'WunderbaumDetailComponent' ||
      event.constructor.name === 'ClothesDetailComponent' ||
      event.constructor.name === 'OrdersComponent' ||
      event.constructor.name === 'DeliveryAddressComponent' ||
      event.constructor.name === 'ShippingMethodComponent' ||
      event.constructor.name === 'PaymentMethodComponent' ||
      event.constructor.name === 'OrderReviewComponent'
    ) {
      window.scroll({
        top: 40,
        left: 0,
        behavior: 'smooth',
      });
    } else {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }
}
