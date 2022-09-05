import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard';

import { DeliveryAddressComponent } from './delivery-address/delivery-address.component';
import { OrderCompletedComponent } from './order-completed/order-completed.component';
import { OrderReviewComponent } from './order-review/order-review.component';
import { OrdersComponent } from './orders-component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { ShippingMethodComponent } from './shipping-method/shipping-method.component';

const routes: Routes = [
  { path: 'order', component: OrdersComponent },
  { path: 'delivery', component: DeliveryAddressComponent },
  {
    path: 'shipping',
    component: ShippingMethodComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'payment',
    component: PaymentMethodComponent,
    canActivate: [AuthGuard],
  },
  { path: 'review', component: OrderReviewComponent, canActivate: [AuthGuard] },
  {
    path: 'sent',
    component: OrderCompletedComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
