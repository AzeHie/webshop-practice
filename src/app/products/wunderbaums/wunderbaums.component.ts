import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { Wunderbaum } from './wunderbaum.model';
import { WunderbaumsService } from '../../services/wunderbaums.service';

@Component({
  selector: 'app-wunderbaums',
  templateUrl: './wunderbaums.component.html',
  styleUrls: ['./wunderbaums.component.css'],
})
export class WunderbaumsComponent implements OnInit {
  wunderbaums: any[] = [];
  private wunderbaumsSub: Subscription;
  order = true;

  constructor(
    private wunderbaumsService: WunderbaumsService,
    private shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit() {
    this.wunderbaumsService.getWunderbaums();
    this.wunderbaumsSub = this.wunderbaumsService
      .getWunderbaumUpdateListener()
      .subscribe((wunderbaumData: { wunderbaums: Wunderbaum[] }) => {
        this.wunderbaums = wunderbaumData.wunderbaums;
      });
  }

  orderByPrice() {
    let tempArr = this.wunderbaums;

    for (let item of tempArr) {
      item.price = parseFloat(item.price);
      item.price = item.price.toFixed(2);
    }

    if (this.order) {
      tempArr.sort((a, b) => a.price - b.price);
    } else if (!this.order) {
      tempArr.sort((a, b) => b.price - a.price);
    }

    this.order = !this.order;
    this.wunderbaums = tempArr;
  }

  ngOnDestroy() {
    this.wunderbaumsSub.unsubscribe();
  }
}
