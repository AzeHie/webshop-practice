import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Product } from 'src/app/products/product-model';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-clothes-detail',
  templateUrl: './clothes-detail.component.html',
  styleUrls: ['./clothes-detail.component.css'],
})
export class ClothesDetailComponent implements OnInit {
  productType = 'Clothes';
  product: Product;
  id: string;
  productImage: string;
  userId: string;
  isAdmin = false;
  isAuthed = false;
  userDetailsSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = paramMap.get('clothId');
      this.productService.getSingleProduct(this.id).subscribe((product) => {
        this.productImage = product.imagePath;
        this.product = {
          productId: product._id,
          title: product.title,
          imagePath: product.imagePath,
          description: product.description,
          price: product.price,
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
    this.productService.deleteProduct(this.id).subscribe(() => {
      this.backToProducts();
    });
  }

  backToProducts() {
    this.router.navigate(['/products/clothes']);
  }
}
