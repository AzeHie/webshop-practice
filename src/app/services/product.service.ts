import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, map } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Product } from '../products/product-model';

const BACKEND_URL = environment.apiUrl + 'products/';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private wunderbaumsUpdated = new Subject<{ wunderbaums: Product[] }>();
  private wunderbaums: Product[] = [];
  private clothesUpdated = new Subject<{ clothes: Product[] }>();
  private clothes: Product[] = [];

  constructor(private http: HttpClient) {}

  getClothesUpdateListener() {
    return this.clothesUpdated.asObservable();
  }

  getWunderbaumsUpdateListener() {
    return this.wunderbaumsUpdated.asObservable();
  }

  getProducts() {
    this.http
      .get<{ message: string; products: any; productType: string }>(BACKEND_URL)
      .pipe(
        map((resData) => {
          return {
            products: resData.products.map((product) => {
              return {
                productId: product._id,
                title: product.title,
                imagePath: product.imagePath,
                description: product.description,
                price: product.price,
                productType: product.productType,
              };
            }),
          };
        })
      )
      .subscribe((transformedResData) => {
        const loadedClothes = transformedResData.products.filter(
          (product) => product.productType === 'clothes'
        );
        const loadedWunderbaums = transformedResData.products.filter(
          (product) => product.productType === 'wunderbaums'
        );
        this.clothes = loadedClothes;
        this.wunderbaums = loadedWunderbaums;
        this.clothesUpdated.next({ clothes: [...this.clothes] });
        this.wunderbaumsUpdated.next({ wunderbaums: [...this.wunderbaums] });
      });
  }

  getSingleProduct(index: string) {
    return this.http.get<{
      _id: string;
      title: string;
      imagePath: string;
      description: string;
      price: string;
      productType: string;
    }>(BACKEND_URL + index);
  }

  addProduct(
    title: string,
    image: File,
    description: string,
    price: string,
    productType: string
  ) {
    const productData = new FormData();

    productData.append('title', title);
    if (image !== null) {
      productData.append('image', image, title);
    }
    productData.append('description', description);
    productData.append('price', price);
    productData.append('productType', productType);

    this.http.post<{ message: string; product: Product }>(
      BACKEND_URL,
      productData
    ).subscribe(res => {
      console.log(res);
    });
  }

  updateProduct(
    id: string,
    title: string,
    image: File | string,
    description: string,
    price: string,
    productType: string
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
      productData.append('productType', productType);
    } else {
      productData = {
        productId: id,
        title: title,
        imagePath: image,
        description: description,
        price: price,
        productType: productType,
      };
    }
    this.http.put(BACKEND_URL + id, productData);
  }

  deleteProduct(id: string) {
    return this.http.delete(BACKEND_URL + id);
  }
}
