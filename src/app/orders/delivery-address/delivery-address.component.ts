import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-delivery-address',
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.css'],
})
export class DeliveryAddressComponent implements OnInit, OnDestroy {
  userDetails: any;
  userDetailsSub: Subscription;
  authListenerSub: Subscription;
  current: string;
  isAuthed = false;
  isloading = false;
  isOrdering = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.isAuthed = this.authService.getIsAuthed();
    this.userDetailsSub = this.authService
      .getUserUpdateListener()
      .subscribe((authData) => {
        this.userDetails = authData;
      });
    this.authService.getAuthStatusListener().subscribe((isUserAuthed) => {
      this.isAuthed = isUserAuthed;
    });
  }

  onLogin(form: NgForm) {
    this.isloading = true;
    this.isOrdering = true;
    if (form.invalid) {
      return;
    }
    this.authService.login(
      form.value.email,
      form.value.password,
      this.isOrdering
    );
  }

  onEdit() {
    this.router.navigate(['/profile/edit']);
  }

  onNavigation() {
    this.orderService.addCustomerDetails();
    this.router.navigate(['/orders/shipping']);
  }

  onPrevious() {
    this.router.navigate(['/orders/order']);
  }

  ngOnDestroy(): void {
    this.userDetailsSub.unsubscribe();
  }
}
