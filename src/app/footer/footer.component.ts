import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'app-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.css'],
})
export class FooterComponent implements OnInit {
  itemsInCart: number = 0;

  constructor(private shoppingcartService: ShoppingCartService) {}

  ngOnInit(): void {
    this.shoppingcartService.getAmountOfItems().subscribe((res) => {
      this.itemsInCart = res;
    });
  }
}
