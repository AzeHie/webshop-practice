import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-review',
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.css'],
})
export class OrderReviewComponent implements OnInit, OnDestroy {
  detailsOk = false;
  products: any = [];
  customer: any = {};
  shipping: string;
  payment: string;
  orderSub: Subscription;
  totalPrice: any;
  aPrice: any;

  constructor(private router: Router, private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.compileOrder();
    this.orderSub = this.orderService.getOrderDetails().subscribe((res) => {
      this.products = res.products;
      this.customer = res.customerDetails;
      this.shipping = res.shippingMethod;
      this.payment = res.paymentMethod;
    });

    this.totalPrice = this.calcTotalPrice();
    this.totalPrice = this.totalPrice.toFixed(2);
  }

  onPrevious() {
    this.router.navigate(['/orders/payment']);
  }

  onSendOrder() {
    this.orderService.saveOrder();
  }

  calcTotalPrice() {
    let price = 0;
    for (let item of this.products) {
      price += +item.price;
    }
    return price;
  }

  calcSinglePrice(index: number) {
    let price: any;
    price = this.products[index].price / this.products[index].amount;
    price = price.toFixed(2);
    return price;
  }

  ngOnDestroy(): void {
    this.orderSub.unsubscribe();
  }
}
