import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/order.service';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders-component.html',
  styleUrls: ['./orders-component.css'],
})
export class OrdersComponent implements OnInit {
  current: string = 'cartSummary';
  backgrounds: any = {};
  cartItemList: any = [];
  grandTotal: number;
  itemsAmount: number = 0;
  deleteOne = false;
  isAuthed = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.shoppingCartService.getProducts().subscribe((res) => {
      this.cartItemList = res;
    });

    this.shoppingCartService.getAmountOfItems().subscribe((res) => {
      this.itemsAmount = res;
    });

    this.shoppingCartService.getTotalPrice().subscribe((res) => {
      this.grandTotal = res;
    });

    this.isAuthed = this.authService.getIsAuthed();
  }

  onNavigation() {
    this.orderService.removeStorage();
    this.orderService.addProducts(this.cartItemList);
    this.router.navigate(['/orders/delivery']);
  }

  onAddOne(item: any) {
    this.shoppingCartService.addToCart(item, this.isAuthed);
  }

  onRemoveOne(item: any) {
    this.deleteOne = true;
    this.shoppingCartService.removeFromCart(
      item,
      this.deleteOne,
      this.isAuthed
    );
    this.deleteOne = false;
    if (this.itemsAmount < 1) {
      this.router.navigate(['/cart']);
    }
  }

  onRemove(item: any) {
    this.shoppingCartService.removeFromCart(
      item,
      this.deleteOne,
      this.isAuthed
    );
    if (this.itemsAmount < 1) {
      this.router.navigate(['/cart']);
    }
  }
}
