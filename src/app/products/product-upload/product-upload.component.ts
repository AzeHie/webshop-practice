import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { mimeType } from '../../shared/custom-validators/mime-type.validator';
import { Product } from '../product-model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-upload',
  templateUrl: './product-upload.component.html',
  styleUrls: ['./product-upload.component.css'],
})
export class ProductUploadComponent implements OnInit {
  private mode = 'add';
  productId: string = '';
  product: Product;
  form: FormGroup;
  imagePreview: string = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      productType: new FormControl(null, { validators: [Validators.required] }),
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      image: new FormControl(null, { asyncValidators: [mimeType] }),
      description: new FormControl(null, { validators: [Validators.required] }),
      price: new FormControl(null, { validators: [Validators.required] }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('productId')) {
        this.mode = 'edit';
        this.productId = paramMap.get('productId');
        this.productService
          .getSingleProduct(this.productId)
          .subscribe((productData) => {
            this.imagePreview = productData.imagePath;
            this.form.setValue({
              title: productData.title,
              image: productData.imagePath,
              description: productData.description,
              price: productData.price,
              productType: productData.productType,
            });
          });
      } else {
        this.mode = 'add';
        this.productId = null;
      }
    });
  }

  onAddProduct() {
    console.log("mennäänkö tänne");
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'edit') {
      this.productService.updateProduct(
        this.productId,
        this.form.value.title,
        this.form.value.image,
        this.form.value.description,
        this.form.value.price,
        this.form.value.productType
      );
    } else {
        this.productService.addProduct(
          this.form.value.title,
          this.form.value.image,
          this.form.value.description,
          this.form.value.price,
          this.form.value.productType
        );
      }
      this.onCancel();
    }

  onCancel() {
    this.router.navigate(['/']);
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file }); //patchValue allows targeting to single control
    this.form.get('image').updateValueAndValidity(); //tells angular that value is changed and it should re-evalute that
    const reader = new FileReader();
    reader.onload = () => {
      //converting image to url
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
