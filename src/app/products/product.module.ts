import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { AngularMaterialsModule } from '../angular-materials.module';
import { AccessoriesDetailComponent } from './accessories/accessories-detail/accessories-detail.component';
import { AccessoriesComponent } from './accessories/accessories.component';
import { ClothesDetailComponent } from './clothes/clothes-detail/clothes-detail.component';
import { ClothesComponent } from './clothes/clothes.component';
import { GiftCardsComponent } from './gift-cards/gift-cards.component';
import { ProductRoutingModule } from './product-routing.module';
import { ProductUploadComponent } from './product-upload/product-upload.component';
import { WunderbaumDetailComponent } from './wunderbaums/wunderbaum-detail/wunderbaum-detail.component';
import { WunderbaumsComponent } from './wunderbaums/wunderbaums.component';

@NgModule({
  declarations: [
    WunderbaumsComponent,
    WunderbaumDetailComponent,
    AccessoriesComponent,
    AccessoriesDetailComponent,
    ClothesComponent,
    ClothesDetailComponent,
    GiftCardsComponent,
    ProductUploadComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialsModule,
    FormsModule,
    ReactiveFormsModule,
    ProductRoutingModule,
    NgxImageZoomModule,
  ],
})
export class ProductModule {}
