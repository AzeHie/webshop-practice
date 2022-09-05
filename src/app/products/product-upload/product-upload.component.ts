import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ClothesService } from '../../services/clothes.service';
import { mimeType } from '../../shared/custom-validators/mime-type.validator';
import { WunderbaumsService } from '../../services/wunderbaums.service';
import { Product } from '../product-model';

@Component({
  selector: 'app-product-upload',
  templateUrl: './product-upload.component.html',
  styleUrls: ['./product-upload.component.css'],
})
export class ProductUploadComponent implements OnInit {
  private mode = 'add';
  productId: string;
  productTypeForEdit: string;
  product: Product;
  form: FormGroup;
  imagePreview: string;

  constructor(
    private wunderbaumsService: WunderbaumsService,
    private clothesService: ClothesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      producttype: new FormControl(null, { validators: [Validators.required] }),
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
        this.productTypeForEdit = paramMap.get('productType');
        switch (this.productTypeForEdit) {
          case 'wunderbaums':
            this.wunderbaumsService
              .getSinglewunderbaum(this.productId)
              .subscribe((productData) => {
                this.product = {
                  productId: productData._id,
                  title: productData.title,
                  imagePath: productData.imagePath,
                  description: productData.description,
                  price: productData.price,
                };
                this.imagePreview = this.product.imagePath;
                this.form.setValue({
                  producttype: this.productTypeForEdit,
                  title: this.product.title,
                  image: this.product.imagePath,
                  description: this.product.description,
                  price: this.product.price,
                });
              });
            break;
          case 'clothes':
            this.clothesService
              .getSingleProduct(this.productId)
              .subscribe((productData) => {
                this.product = {
                  productId: productData._id,
                  title: productData.title,
                  imagePath: productData.imagePath,
                  description: productData.description,
                  price: productData.price,
                };
                this.imagePreview = this.product.imagePath;
                this.form.setValue({
                  producttype: this.productTypeForEdit,
                  title: this.product.title,
                  image: this.product.imagePath,
                  description: this.product.description,
                  price: this.product.description,
                });
              });
            break;

          case 'accessories':
            // accessoriesService
            break;

          default:
            break;
        }
      } else {
        this.mode = 'add';
        this.productId = null;
      }
    });
  }

  onAddProduct() {
    if (this.form.invalid) {
      return;
    }

    const productType = this.form.value.producttype;
    if (productType === 'wunderbaums') {
      if (this.mode === 'edit') {
        this.wunderbaumsService.updateWunderbaum(
          this.productId,
          this.form.value.title,
          this.form.value.image,
          this.form.value.description,
          this.form.value.price
        );
      } else {
        this.wunderbaumsService.addWunderbaum(
          this.form.value.title,
          this.form.value.image,
          this.form.value.description,
          this.form.value.price
        );
      }
    }
    if (productType === 'Accessories') {
    }
    if (productType === 'clothes') {
      if (this.mode === 'edit') {
        this.clothesService.updateProduct(
          this.productId,
          this.form.value.title,
          this.form.value.image,
          this.form.value.description,
          this.form.value.price
        );
      } else {
        this.clothesService.addProduct(
          this.form.value.title,
          this.form.value.image,
          this.form.value.description,
          this.form.value.price
        );
      }
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
