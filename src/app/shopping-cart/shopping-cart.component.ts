import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingcartComponent implements OnInit {
  grandTotal: number;
  itemsAmount: number = 0;
  cartEmpty = true;
  deleteOne = false;
  isAuthed = false;
  isloading = false;
  cartItemList: any = [];

  constructor(
    private shoppingCartService: ShoppingCartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.shoppingCartService.getProducts().subscribe((res) => {
      this.cartItemList = res;
      if (res.length > 0) {
        this.cartEmpty = false;
      }
    });
    this.shoppingCartService.getAmountOfItems().subscribe((res) => {
      this.itemsAmount = res;
    });
    this.shoppingCartService.getTotalPrice().subscribe((res) => {
      this.grandTotal = res;
      this.isloading = false;
    });
    this.isAuthed = this.authService.getIsAuthed();
  }

  onAddOne(item: any) {
    this.isloading = true;
    this.shoppingCartService.addToCart(item, this.isAuthed);
  }

  onRemoveOne(item: any) {
    this.isloading = true;
    this.deleteOne = true;
    this.shoppingCartService.removeFromCart(
      item,
      this.deleteOne,
      this.isAuthed
    );
    this.deleteOne = false;
    if (this.itemsAmount < 1) {
      this.cartEmpty = true;
    }
  }

  onRemove(item: any) {
    this.isloading = true;
    this.shoppingCartService.removeFromCart(
      item,
      this.deleteOne,
      this.isAuthed
    );
    if (this.itemsAmount < 1) {
      this.cartEmpty = true;
    }
  }

  order() {
    this.router.navigate(['/orders/order']);
  }

  continueShopping() {
    this.router.navigate(['/']);
  }
}
