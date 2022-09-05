import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

import { environment } from 'src/environments/environment';
import { EventDialogComponent } from '../shared/event-dialog/event-dialog.component';
import { ShoppingCartService } from './shopping-cart.service';
import { AuthData } from '../auth/auth-data.module';

const BACKEND_URL = environment.apiUrl + 'auth/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userDetails: AuthData;
  private isAuthed = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private user = new BehaviorSubject<AuthData>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private shoppingcartService: ShoppingCartService
  ) {}

  getToken() {
    return this.token;
  }

  getIsAuthed() {
    return this.isAuthed;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserUpdateListener() {
    return this.user.asObservable();
  }

  getUserId() {
    return this.userDetails.id;
  }

  getUserDetails() {
    return this.userDetails;
  }

  createUser(
    firstname: string,
    lastname: string,
    address: string,
    postcode: string,
    city: string,
    email: string,
    password: string
  ) {
    const authData: AuthData = {
      id: '',
      firstname: firstname,
      lastname: lastname,
      address: address,
      postcode: postcode,
      city: city,
      email: email,
      password: password,
    };
    this.http
      .post<{ message: string }>(BACKEND_URL + 'signup', authData)
      .subscribe(
        (result) => {
          this.dialog.open(EventDialogComponent, {
            data: { message: 'User created!' },
          });
          this.router.navigate(['/login']);
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  login(email: string, password: string, isOrdering: boolean) {
    const loginData = { email: email, password: password };
    this.http
      .post<{
        token: string;
        expiresIn: number;
        userId: string;
        firstname: string;
        lastname: string;
        address: string;
        postcode: string;
        city: string;
        email: string;
      }>(BACKEND_URL + 'login', loginData)
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.userDetails = {
              id: response.userId,
              firstname: response.firstname,
              lastname: response.lastname,
              address: response.address,
              postcode: response.postcode,
              city: response.city,
              email: response.email,
              password: '',
            };
            this.isAuthed = true;
            this.authStatusListener.next(true);
            this.user.next(this.userDetails);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            ); // creating expDate for the localstorage
            this.saveAuthData(token, expirationDate, this.userDetails);
            this.shoppingcartService.updateCartOnLogin();
            if (isOrdering) {
              this.router.navigate(['/orders/order']);
              this.dialog.open(EventDialogComponent, {
                data: { message: 'Logged in!' },
              });
            } else {
              this.router.navigate(['/']);
            }
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoLogin() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userDetails = authInformation.userDetails;
      this.isAuthed = true;
      this.setAuthTimer(expiresIn / 1000); // divide because authTimer is working with seconds, and expiresIn is milliseconds
      this.authStatusListener.next(true);
      this.user.next(authInformation.userDetails);
    }
  }

  updateUser(userData: any) {
    const authData: AuthData = {
      id: '',
      firstname: userData.firstname,
      lastname: userData.lastname,
      address: userData.address,
      postcode: userData.postcode,
      city: userData.city,
      email: userData.email,
      password: '',
    };
    this.http
      .put<{ message: string; userDetails: any }>(
        BACKEND_URL + '/updateuser',
        authData
      )
      .subscribe((response) => {
        this.userDetails = {
          id: response.userDetails.userId,
          firstname: response.userDetails.firstname,
          lastname: response.userDetails.lastname,
          address: response.userDetails.address,
          postcode: response.userDetails.postcode,
          city: response.userDetails.city,
          email: response.userDetails.email,
          password: '',
        };
        this.updateAuthData(this.userDetails);
        this.user.next(this.userDetails);
        this.dialog.open(EventDialogComponent, {
          data: { message: 'Userdetails updated!' },
        });
      });
  }

  changePassword(
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    const passwordData = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    };
    this.http
      .put<{ message: string }>(BACKEND_URL + '/changepassword', passwordData)
      .subscribe((res) => {
        if (res.message === 'Password updated!') {
          this.dialog.open(EventDialogComponent, {
            data: { message: 'Password updated!' },
          });
          this.router.navigate(['/profile']);
        }
      });
  }

  logout() {
    this.token = null;
    this.isAuthed = false;
    this.authStatusListener.next(false);
    this.shoppingcartService.emptyCart(this.isAuthed);
    this.user.next(null);
    this.userDetails = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/login']);
    this.dialog.open(EventDialogComponent, {
      data: { message: 'Logged out!' },
    });
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userDetails = {
      id: localStorage.getItem('userId'),
      firstname: localStorage.getItem('firstname'),
      lastname: localStorage.getItem('lastname'),
      address: localStorage.getItem('address'),
      postcode: localStorage.getItem('postcode'),
      city: localStorage.getItem('city'),
      email: localStorage.getItem('email'),
      password: '',
    };
    if (!token || !expirationDate) {
      return null;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      //creating new date object based on that ISOString date made in saveAuthData()
      userDetails: userDetails,
    };
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userDetails: AuthData
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userDetails.id);
    localStorage.setItem('firstname', userDetails.firstname);
    localStorage.setItem('lastname', userDetails.lastname);
    localStorage.setItem('address', userDetails.address);
    localStorage.setItem('postcode', userDetails.postcode);
    localStorage.setItem('city', userDetails.city);
    localStorage.setItem('email', userDetails.email);
  }

  private updateAuthData(userDetails: AuthData) {
    localStorage.setItem('firstname', userDetails.firstname);
    localStorage.setItem('lastname', userDetails.lastname);
    localStorage.setItem('address', userDetails.address);
    localStorage.setItem('postcode', userDetails.postcode);
    localStorage.setItem('city', userDetails.city);
    localStorage.setItem('email', userDetails.email);
  }

  private clearAuthData() {
    localStorage.clear();
  }
}
