import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../products/product-model';

const BACKEND_URL = environment.apiUrl + 'wunderbaums/';

@Injectable({ providedIn: 'root' })
export class WunderbaumsService {
  private wunderbaumsUpdated = new Subject<{ wunderbaums: Product[] }>();
  private wunderbaums: Product[] = [];

  constructor(private http: HttpClient) {}

  getWunderbaumUpdateListener() {
    return this.wunderbaumsUpdated.asObservable();
  }

  getWunderbaums() {
    // return this.wunderbaums.slice();
    this.http
      .get<{ message: string; wunderbaums: any }>(BACKEND_URL)
      .pipe(
        map((wunderbaumData) => {
          return {
            wunderbaums: wunderbaumData.wunderbaums.map((wunderbaum) => {
              return {
                productId: wunderbaum._id,
                title: wunderbaum.title,
                imagePath: wunderbaum.imagePath,
                description: wunderbaum.description,
                price: wunderbaum.price,
              };
            }),
          };
        })
      )
      .subscribe((transformedWunderbaumData) => {
        this.wunderbaums = transformedWunderbaumData.wunderbaums;
        this.wunderbaumsUpdated.next({
          wunderbaums: [...this.wunderbaums],
        });
      });
  }

  getSinglewunderbaum(index: string) {
    return this.http.get<{
      _id: string;
      title: string;
      imagePath: string;
      description: string;
      price: string;
    }>(BACKEND_URL + index);
  }

  addWunderbaum(
    title: string,
    image: File,
    description: string,
    price: string
  ) {
    const wunderbaumData = new FormData(); // data format which allows us to combine text values and files.
    wunderbaumData.append('title', title);
    if (image !== null) {
      wunderbaumData.append('image', image, title);
    }
    wunderbaumData.append('description', description);
    wunderbaumData.append('price', price);
    this.http
      .post<{ message: string; wunderbaum: Product }>(
        BACKEND_URL,
        wunderbaumData
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  updateWunderbaum(
    id: string,
    title: string,
    image: File | string,
    description: string,
    price: string
  ) {
    let wunderbaumData: Product | FormData;
    if (typeof image === 'object') {
      wunderbaumData = new FormData();
      wunderbaumData.append('id', id);
      wunderbaumData.append('title', title);
      if (image !== null) {
        wunderbaumData.append('image', image, title);
      } else {
        wunderbaumData.append('image', '');
      }
      wunderbaumData.append('description', description);
      wunderbaumData.append('price', price);
    } else {
      wunderbaumData = {
        productId: id,
        title: title,
        imagePath: image,
        description: description,
        price: price,
      };
    }
    this.http.put(BACKEND_URL + id, wunderbaumData).subscribe((response) => {
      console.log(response);
    });
  }

  deleteWunderbaum(id: string) {
    return this.http.delete(BACKEND_URL + id);
  }
}
