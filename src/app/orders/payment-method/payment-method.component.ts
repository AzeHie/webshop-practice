import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css'],
})
export class PaymentMethodComponent implements OnInit, OnDestroy {
  userChoice = '';
  paymentMethodSub: Subscription;

  constructor(private router: Router, private orderService: OrderService) {}

  ngOnInit(): void {
    this.paymentMethodSub = this.orderService
      .getPaymentMethod()
      .subscribe((res) => {
        this.userChoice = res;
      });
  }

  onPrevious() {
    this.router.navigate(['/orders/shipping']);
  }

  onNavigation() {
    this.orderService.addPaymentMethod(this.userChoice);
    this.router.navigate(['/orders/review']);
  }

  ngOnDestroy(): void {
    this.paymentMethodSub.unsubscribe();
  }
}
