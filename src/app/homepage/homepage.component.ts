import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Product } from '../products/product-model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit, OnDestroy {
  wunderbaums: Product[] = [];
  clothes: Product[] = [];
  private wunderbaumsSub: Subscription;
  private clothesSub: Subscription;

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts();

    this.wunderbaumsSub = this.productService
      .getWunderbaumsUpdateListener()
      .subscribe((resData: { wunderbaums: Product[] }) => {
        this.wunderbaums = resData.wunderbaums;
      });

    this.clothesSub = this.productService
      .getClothesUpdateListener()
      .subscribe((resData: { clothes: Product[] }) => {
        this.clothes = resData.clothes;
      });
  }

  ngOnDestroy(): void {
    this.wunderbaumsSub.unsubscribe();
    this.clothesSub.unsubscribe();
  }
}
