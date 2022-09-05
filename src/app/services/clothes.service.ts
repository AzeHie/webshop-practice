import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../products/product-model';

const BACKEND_URL = environment.apiUrl + 'clothes/';

@Injectable({ providedIn: 'root' })
export class ClothesService {
  private clothesUpdated = new Subject<{ clothes: Product[] }>();
  private clothes: Product[] = [];

  constructor(private http: HttpClient) {}

  getClothUpdateListener() {
    return this.clothesUpdated.asObservable();
  }

  getClothes() {
    this.http
      .get<{ message: string; clothes: any }>(BACKEND_URL)
      .pipe(
        map((productData) => {
          return {
            clothes: productData.clothes.map((product) => {
              return {
                productId: product._id,
                title: product.title,
                imagePath: product.imagePath,
                description: product.description,
                price: product.price,
              };
            }),
          };
        })
      )
      .subscribe((transformedProductData) => {
        this.clothes = transformedProductData.clothes;
        this.clothesUpdated.next({
          clothes: [...this.clothes],
        });
      });
  }

  getSingleProduct(index: string) {
    return this.http.get<{
      _id: string;
      title: string;
      imagePath: string;
      description: string;
      price: string;
    }>(BACKEND_URL + index);
  }

  addProduct(title: string, image: File, description: string, price: string) {
    const productData = new FormData();
    productData.append('title', title);
    if (image !== null) {
      productData.append('image', image, title);
    }
    productData.append('description', description);
    productData.append('price', price);
    this.http
      .post<{ message: string; product: Product }>(BACKEND_URL, productData)
      .subscribe(() => {});
  }

  updateProduct(
    id: string,
    title: string,
    image: File | string,
    description: string,
    price: string
  ) {
    let productData: Product | FormData;
    if (typeof image === 'object') {
      productData = new FormData();
      productData.append('id', id);
      productData.append('title', title);
      if (image !== null) {
        productData.append('image', image, title);
      } else {
        productData.append('image', '');
      }
      productData.append('description', description);
      productData.append('price', price);
    } else {
      productData = {
        productId: id,
        title: title,
        imagePath: image,
        description: description,
        price: price,
      };
    }
    this.http.put(BACKEND_URL + id, productData).subscribe(() => {});
  }

  deleteProduct(id: string) {
    return this.http.delete(BACKEND_URL + id);
  }
}
