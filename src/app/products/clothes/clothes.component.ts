import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../product-model';
import { ClothesService } from '../../services/clothes.service';

@Component({
  selector: 'app-clothes',
  templateUrl: './clothes.component.html',
  styleUrls: ['./clothes.component.css'],
})
export class ClothesComponent implements OnInit, OnDestroy {
  clothes: any[] = [];
  private productSub: Subscription;
  order = true;
  isloading = false;

  constructor(private clothesService: ClothesService) {}

  ngOnInit(): void {
    this.isloading = true;
    this.clothesService.getClothes();
    this.productSub = this.clothesService
      .getClothUpdateListener()
      .subscribe((productData: { clothes: Product[] }) => {
        this.clothes = productData.clothes;
        this.isloading = false;
      });
  }

  orderByPrice() {
    let tempArr = this.clothes;

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
    this.clothes = tempArr;
  }

  ngOnDestroy() {
    this.productSub.unsubscribe();
  }
}
