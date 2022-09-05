import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialsModule } from '../angular-materials.module';
import { SharedModule } from '../shared/shared.module';
import { DeliveryAddressComponent } from './delivery-address/delivery-address.component';
import { OrderCompletedComponent } from './order-completed/order-completed.component';
import { OrderReviewComponent } from './order-review/order-review.component';
import { OrderRoutingModule } from './order-routing.module';
import { OrdersComponent } from './orders-component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { ShippingMethodComponent } from './shipping-method/shipping-method.component';

@NgModule({
  declarations: [
    OrdersComponent,
    OrderReviewComponent,
    OrderCompletedComponent,
    DeliveryAddressComponent,
    ShippingMethodComponent,
    PaymentMethodComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialsModule,
    ReactiveFormsModule,
    OrderRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class OrderModule {}
