import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { WunderbaumsService } from '../../services/wunderbaums.service';
import { Product } from '../product-model';

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
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.productService.getProducts();
    this.wunderbaumsSub = this.productService
      .getWunderbaumsUpdateListener()
      .subscribe((wunderbaumData: { wunderbaums: Product[] }) => {
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
