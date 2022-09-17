import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { WunderbaumsService } from '../../../services/wunderbaums.service';
import { Subscription } from 'rxjs';
import { Product } from '../../product-model';

@Component({
  selector: 'app-wunderbaum-detail',
  templateUrl: './wunderbaum-detail.component.html',
  styleUrls: ['./wunderbaum-detail.component.css'],
})
export class WunderbaumDetailComponent implements OnInit {
  productType = 'wunderbaums';
  id: string;
  userId: string;
  isAuthed = false;
  isAdmin = false;
  wunderbaum: Product;
  productImage: string;
  userDetailsSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private wunderbaumsService: WunderbaumsService,
    private shoppingCartService: ShoppingCartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = paramMap.get('wunderbaumId');
      this.wunderbaumsService
        .getSinglewunderbaum(this.id)
        .subscribe((singleWunderbaum) => {
          this.productImage = singleWunderbaum.imagePath;
          this.wunderbaum = {
            productId: singleWunderbaum._id,
            title: singleWunderbaum.title,
            imagePath: singleWunderbaum.imagePath,
            description: singleWunderbaum.description,
            price: singleWunderbaum.price,
          };
        });
    });
    this.userDetailsSub = this.authService
    .getUserUpdateListener()
    .subscribe((authData) => {
      if (authData) {
        // temp solution for productUpload - NOT SAFE TO USE IN REAL PROJECTS!
        this.userId = authData.id;
        if (this.userId === '62852397eb4f09af1b48e6cf') {
          this.isAdmin = true;
        }
      }
    });
    this.isAuthed = this.authService.getIsAuthed();

  }

  onAddToCart(product: any) {
    this.shoppingCartService.addToCart(product, this.isAuthed);
  }

  onEdit() {
    this.router.navigate([
      '/products/upload/' + this.productType + '/' + this.id,
    ]);
  }

  onDelete() {
    this.wunderbaumsService.deleteWunderbaum(this.id).subscribe(() => {
      this.backToProducts();
    });
  }

  backToProducts() {
    this.router.navigate(['/products/wunderbaums']);
  }
}
