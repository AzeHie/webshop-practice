import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Product } from 'src/app/products/product-model';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { ClothesService } from '../../../services/clothes.service';

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
  isAuthed = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clothesService: ClothesService,
    private shoppingCartService: ShoppingCartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = paramMap.get('clothId');
      this.clothesService.getSingleProduct(this.id).subscribe((product) => {
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
    this.clothesService.deleteProduct(this.id).subscribe(() => {
      this.backToProducts();
    });
  }

  backToProducts() {
    this.router.navigate(['/products/clothes']);
  }
}
