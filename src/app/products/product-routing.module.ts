import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessoriesDetailComponent } from './accessories/accessories-detail/accessories-detail.component';
import { AccessoriesComponent } from './accessories/accessories.component';
import { ClothesDetailComponent } from './clothes/clothes-detail/clothes-detail.component';
import { ClothesComponent } from './clothes/clothes.component';
import { GiftCardsComponent } from './gift-cards/gift-cards.component';
import { ProductUploadComponent } from './product-upload/product-upload.component';
import { WunderbaumDetailComponent } from './wunderbaums/wunderbaum-detail/wunderbaum-detail.component';
import { WunderbaumsComponent } from './wunderbaums/wunderbaums.component';

const routes: Routes = [
  { path: 'wunderbaums', component: WunderbaumsComponent },
  { path: 'wunderbaums/:wunderbaumId', component: WunderbaumDetailComponent },
  { path: 'clothes', component: ClothesComponent },
  { path: 'clothes/:clothId', component: ClothesDetailComponent },
  { path: 'accessories', component: AccessoriesComponent },
  { path: 'accessories/:accessoryId', component: AccessoriesDetailComponent },
  { path: 'giftcards', component: GiftCardsComponent },
  { path: 'upload', component: ProductUploadComponent },
  { path: 'upload/:productId', component: ProductUploadComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
