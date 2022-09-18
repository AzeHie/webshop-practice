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
    // if there is items in localstorage when user logs in, add them to the personal cart in the database
    let isAuthed = true;
    let itemsFromStorage = [];

    const storage = JSON.parse(localStorage.getItem('cartItems'));
    if (!storage) {
      this.loadCartData(isAuthed);
      isAuthed = false;
    } else {
      storage.forEach(item => {
        itemsFromStorage.push(item);
      });
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
      // if not authed, load items from the local storage only
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

    // check if product is already in cart?, for requests coming from productServices
    product = this.cartItemList.filter(item => product.productId === item.productId);

    // add amount field to the product, if doesn't exist already
    if (!product.amount) {
      modifiedProduct = {
        ...product,
        amount: 1,
      };
    } else {
      modifiedProduct = product;
    }
    modifiedProduct.price = parseFloat(modifiedProduct.price);

    // "EDIT" excisting product in the shopping cart (when changing amount of item):
    let productForEdit = this.cartItemList.filter(item => item.productId === modifiedProduct.productId);

    if(productForEdit.length > 0) {
      let aPrice = modifiedProduct.price / productForEdit[0].amount;
      modifiedProduct.price += aPrice;
      modifiedProduct.amount++;
      modifiedProduct.price = modifiedProduct.price.toFixed(2);
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

      // update localstorage && productList subject:
      this.cartItemList = this.cartItemList.map(item => {
        if (item.productId === modifiedProduct.productId) {
          return modifiedProduct;
        }
        return item;
      });
      localStorage.setItem('cartItems', JSON.stringify(this.cartItemList));
      this.productList.next(this.cartItemList);
      this.calcTotals();
      return;
    }
    // add new item to cart, didn't exist already
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
    this.cartItemList.map((item: any) => {
      totalPrice += +item.price;
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


  removeFromCart(product: any, deleteOne: boolean, authed: boolean) {
    let isAuthed = authed;
    let productForEdit;

    productForEdit = this.cartItemList.filter(item => item.productId === product.productId);

    // if amount > 1, then edit cart: (else, remove whole product)..
    if(productForEdit.amount > 1 && deleteOne) {
      let aPrice = +productForEdit.price / +productForEdit.amount;
      productForEdit.price -= aPrice;
      productForEdit.price = productForEdit.price.toFixed(2);
      productForEdit.amount--;

      if (isAuthed) {
        const productData = {
          productId: productForEdit.productId,
          price: productForEdit.price,
          amount: productForEdit.amount
        };
        this.http
          .put<{ message: string; product: any }>(BACKEND_URL, productData)
            .subscribe((res) => {});
      };

      this.cartItemList = this.cartItemList.map(item => {
        if (item.productId === product.productId) {
          return productForEdit;
        }
        return item;
      });

      localStorage.setItem('cartItems', JSON.stringify(this.cartItemList));

    } else { // remove whole product;
      if (isAuthed) {
        let productId = productForEdit.productId;
        this.http
          .delete<{ message: string }>(BACKEND_URL + productId)
          .subscribe((res) => {});
      }
      this.cartItemList = this.cartItemList.filter(item => item.productId === productForEdit.productId);
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
    this.productList.next(this.cartItemList);
    localStorage.removeItem('cartItems');
    this.calcTotals();

    // for request coming from order service, when the order is sent:
    if (isAuthed) {
      this.http.delete<{ message: string }>(BACKEND_URL).subscribe((res) => {});
    }
  }
}
