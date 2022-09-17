import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ClothesService } from '../services/clothes.service';
import { Product } from '../products/product-model';
import { WunderbaumsService } from '../services/wunderbaums.service';

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
    private wunderbaumsService: WunderbaumsService,
    private clothesService: ClothesService
  ) {}

  ngOnInit(): void {
    this.wunderbaumsService.getWunderbaums();
    this.clothesService.getClothes();
    // this.accessoriesService.getAccessories();
    this.wunderbaumsSub = this.wunderbaumsService
      .getWunderbaumUpdateListener()
      .subscribe((resData: { wunderbaums: Product[] }) => {
        this.wunderbaums = resData.wunderbaums;
      });
    this.clothesSub = this.clothesService
      .getClothUpdateListener()
      .subscribe((resData: { clothes: Product[] }) => {
        this.clothes = resData.clothes;
      });
    // this.accessoriesSub = this.accessoriesService.getAccessoryUpdateListener()
    //   .subscribe((resData: { accessories: Product[] }) => {
    //     this.accessories = resData.accessories
    //   });
  }

  ngOnDestroy(): void {
    this.wunderbaumsSub.unsubscribe();
    this.clothesSub.unsubscribe();
    // this.accessoriesSub.unsubscribe();
  }
}
