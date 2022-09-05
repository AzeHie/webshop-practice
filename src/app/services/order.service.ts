import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EventDialogComponent } from '../shared/event-dialog/event-dialog.component';
import { AuthService } from './auth.service';
import { ShoppingCartService } from './shopping-cart.service';

const BACKEND_URL = environment.apiUrl + 'orders/';

@Injectable({ providedIn: 'root' })
export class OrderService {
  orderSummary = new BehaviorSubject<any>([]);
  shippingMethod = new BehaviorSubject('');
  paymentMethod = new BehaviorSubject('');
  customerDetails: any;
  products: any = [];

  constructor(
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService,
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog
  ) {}

  addProducts(products: any[]) {
    const tempProducts = [];
    for (let item of products) {
      const product = {
        productId: item.productId,
        title: item.title,
        price: item.price,
        amount: item.amount,
      };
      tempProducts.push(product);
    }
    this.products = tempProducts;
    localStorage.setItem('orderProducts', JSON.stringify(this.products));
  }

  addCustomerDetails() {
    let customer = this.authService.getUserDetails();
    this.customerDetails = {
      id: customer.id,
      firstname: customer.firstname,
      lastname: customer.lastname,
      address: customer.address,
      postcode: customer.postcode,
      city: customer.city,
      email: customer.email,
    };
    localStorage.setItem('orderCustomer', JSON.stringify(this.customerDetails));
  }

  addShippingMethod(shippingMethod: string) {
    this.shippingMethod.next(shippingMethod);
    localStorage.setItem('orderShippingMethod', shippingMethod);
  }

  addPaymentMethod(paymentMethod: string) {
    this.paymentMethod.next(paymentMethod);
    localStorage.setItem('orderPaymentMethod', paymentMethod);
  }

  compileOrder() {
    const products = JSON.parse(localStorage.getItem('orderProducts'));
    const customerDetails = JSON.parse(localStorage.getItem('orderCustomer'));
    const shipping = localStorage.getItem('orderShippingMethod');
    const payment = localStorage.getItem('orderPaymentMethod');
    const orderDetails = {
      products: products,
      customerDetails: customerDetails,
      shippingMethod: shipping,
      paymentMethod: payment,
    };
    this.orderSummary.next(orderDetails);
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
  }

  getOrderDetails() {
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails'));
    this.orderSummary.next(orderDetails);
    return this.orderSummary.asObservable();
  }

  getShippingMethod() {
    return this.shippingMethod.asObservable();
  }

  getPaymentMethod() {
    return this.paymentMethod.asObservable();
  }

  saveOrder() {
    let isAuthed = true;
    const products = JSON.parse(localStorage.getItem('orderProducts'));
    const customerDetails = JSON.parse(localStorage.getItem('orderCustomer'));
    const shipping = localStorage.getItem('orderShippingMethod');
    const payment = localStorage.getItem('orderPaymentMethod');
    const orderDetails = {
      products: products,
      customerDetails: customerDetails,
      shippingMethod: shipping,
      paymentMethod: payment,
    };
    this.http
      .post<{ message: string }>(BACKEND_URL, orderDetails)
      .subscribe((res) => {
        this.removeStorage();
        this.shoppingCartService.emptyCart(isAuthed);
        this.products = [];
        this.customerDetails = null;
        this.shippingMethod.next('');
        this.paymentMethod.next('');
        isAuthed = false;
        this.router.navigate(['/orders/sent']);
      });
  }

  removeStorage() {
    localStorage.removeItem('orderDetails');
    localStorage.removeItem('orderProducts');
    localStorage.removeItem('orderCustomer');
    localStorage.removeItem('orderShippingMethod');
    localStorage.removeItem('orderPaymentMethod');
  }
}
