import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-shipping-method',
  templateUrl: './shipping-method.component.html',
  styleUrls: ['./shipping-method.component.css'],
})
export class ShippingMethodComponent implements OnInit, OnDestroy {
  userChoice = '';
  shippingMethodSub: Subscription;

  constructor(private router: Router, private orderService: OrderService) {}

  ngOnInit(): void {
    this.shippingMethodSub = this.orderService
      .getShippingMethod()
      .subscribe((res) => {
        this.userChoice = res;
        if (!this.userChoice) {
          this.userChoice = '';
        }
      });
  }

  onPrevious() {
    this.router.navigate(['/orders/delivery']);
  }

  onNavigation() {
    this.orderService.addShippingMethod(this.userChoice);
    this.router.navigate(['/orders/payment']);
  }

  ngOnDestroy(): void {
    this.shippingMethodSub.unsubscribe();
  }
}
