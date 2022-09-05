import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + 'shoppingcart/';

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {
  cartItemList: any = [];
  productList = new BehaviorSubject<any>([]);
  amountOfItems = new BehaviorSubject(0);
  totalPrice = new BehaviorSubject(0);

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.productList.asObservable();
  }

  updateCartOnLogin() {
    // if there is items in cart on log in, add them to personal cart in the database
    let isAuthed = true;
    let itemsFromStorage = [];
    const storage = JSON.parse(localStorage.getItem('cartItems'));
    if (!storage) {
      this.loadCartData(isAuthed);
      isAuthed = false;
    } else {
      for (let i = 0; i < storage.length; i++) {
        itemsFromStorage.push(storage[i]);
      }
      this.http
        .put<{ message: string; cartItems: any }>(
          BACKEND_URL + '/addStorageItems',
          itemsFromStorage
        )
        .subscribe((res) => {
          this.loadCartData(isAuthed);
          isAuthed = false;
        });
    }
  }

  loadCartData(authed: boolean) {
    let isAuthed = authed;
    if (isAuthed) {
      this.http
        .get<{ message: string; cartItems: any }>(BACKEND_URL)
        .subscribe((res) => {
          this.cartItemList = res.cartItems;
          if (!this.cartItemList) {
            return;
          } else {
            this.productList.next(this.cartItemList);
            this.calcTotals();
          }
        });
    } else {
      // not authed, load items from the local storage only
      const cartItems = JSON.parse(localStorage.getItem('cartItems'));
      this.cartItemList = cartItems;
      if (!this.cartItemList) {
        return;
      } else {
        this.productList.next(this.cartItemList);
        this.calcTotals();
      }
    }
  }

  addToCart(product: any, authed: boolean) {
    let isAuthed = authed;
    let modifiedProduct;
    this.cartItemList = this.cartItemList || [];

    // already in cart?, for requests coming from productServices
    for (let item of this.cartItemList) {
      if (product.productId === item.productId) {
        product = item;
      }
    }
    // add amount "field" to the product, if doesn't exist already
    if (!product.amount) {
      modifiedProduct = {
        ...product,
        amount: 1,
      };
    } else {
      modifiedProduct = product;
    }
    modifiedProduct.price = parseFloat(modifiedProduct.price);

    // "EDIT" excisting product in the shopping cart(when changing amount of item)
    for (let i = 0; i < this.cartItemList.length; i++) {
      if (this.cartItemList[i].productId === modifiedProduct.productId) {
        let aPrice = modifiedProduct.price / this.cartItemList[i].amount;
        modifiedProduct.price += aPrice;
        modifiedProduct.amount++;
        modifiedProduct.price = modifiedProduct.price.toFixed(2);
        this.cartItemList[i] = modifiedProduct;
        if (isAuthed) {
          let productData = {
            productId: modifiedProduct.productId,
            price: modifiedProduct.price,
            amount: modifiedProduct.amount,
          };
          this.http
            .put<{ message: string; cartItem: any }>(BACKEND_URL, productData)
            .subscribe((res) => {});
        }
        localStorage.setItem('cartItems', JSON.stringify(this.cartItemList));
        this.productList.next(this.cartItemList);
        this.calcTotals();
        return;
      }
    }
    // adding new item (not editing excisting one)
    modifiedProduct.price = modifiedProduct.price.toFixed(2);
    if (isAuthed) {
      let productData: any;
      productData = {
        productId: modifiedProduct.productId,
        title: modifiedProduct.title,
        description: modifiedProduct.description,
        price: modifiedProduct.price,
        amount: modifiedProduct.amount,
        imagePath: modifiedProduct.imagePath,
        creator: '', //handling this @ serverside
      };
      this.http
        .post<{ message: string; cartItem: any }>(BACKEND_URL, productData)
        .subscribe((res) => {});
    }
    this.cartItemList.push(modifiedProduct);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItemList));
    this.productList.next(this.cartItemList);
    this.calcTotals();
  }

  calcTotals() {
    //calc price
    let totalPrice = 0;
    let grandTotal;
    this.cartItemList.map((a: any) => {
      totalPrice += +a.price;
    });
    grandTotal = totalPrice.toFixed(2);
    this.totalPrice.next(grandTotal);

    //calc items amount
    let itemsTotal = 0;
    for (let item of this.cartItemList) {
      itemsTotal += item.amount;
    }
    this.amountOfItems.next(itemsTotal);
  }

  getTotalPrice() {
    return this.totalPrice.asObservable();
  }

  getAmountOfItems() {
    return this.amountOfItems.asObservable();
  }

  removeFromCart(item: any, deleteOne: boolean, authed: boolean) {
    let isAuthed = authed;
    for (let i = 0; i < this.cartItemList.length; i++) {
      if (item.productId === this.cartItemList[i].productId) {
        if (deleteOne && this.cartItemList[i].amount > 1) {
          let aPrice = this.cartItemList[i].price / this.cartItemList[i].amount;
          this.cartItemList[i].price -= aPrice;
          this.cartItemList[i].price = this.cartItemList[i].price.toFixed(2);
          this.cartItemList[i].amount--;
          if (isAuthed) {
            let productData = {
              productId: this.cartItemList[i].productId,
              price: this.cartItemList[i].price,
              amount: this.cartItemList[i].amount,
            };
            this.http
              .put<{ message: string; product: any }>(BACKEND_URL, productData)
              .subscribe((res) => {});
          }
          localStorage.setItem('cartItems', JSON.stringify(this.cartItemList));
        } else {
          if (isAuthed) {
            let productId = this.cartItemList[i].productId;
            this.http
              .delete<{ message: string }>(BACKEND_URL + productId)
              .subscribe((res) => {});
          }
          this.cartItemList.splice(i, 1);
        }
        break;
      }
    }
    if (this.cartItemList.length < 1) {
      this.emptyCart(isAuthed);
    } else {
      this.productList.next(this.cartItemList);
      this.calcTotals();
    }
  }

  emptyCart(isAuthed: boolean) {
    this.cartItemList = [];
    if (isAuthed) {
      this.http.delete<{ message: string }>(BACKEND_URL).subscribe((res) => {});
    }
    this.productList.next(this.cartItemList);
    localStorage.removeItem('cartItems');
    this.calcTotals();
  }
}
