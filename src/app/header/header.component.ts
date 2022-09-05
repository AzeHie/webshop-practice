import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  itemsInCart: number = 0;
  userAuthed = false;
  userAdmin = false;
  userFirstname: string = '';
  userId: string = '';
  private authListenerSub: Subscription;
  private userDetailsSub: Subscription;

  constructor(
    private authService: AuthService,
    private shoppingcartService: ShoppingCartService
  ) {}

  ngOnInit(): void {
    this.userAuthed = this.authService.getIsAuthed();
    /* because that info in appComponent is loaded before headercompOnent,
    that makes some issues in the template */

    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthed) => {
        this.userAuthed = isAuthed;
      });
    this.shoppingcartService.getAmountOfItems().subscribe((res) => {
      this.itemsInCart = res;
    });
    this.userDetailsSub = this.authService
      .getUserUpdateListener()
      .subscribe((authData) => {
        if (authData) {
          this.userFirstname = authData.firstname;

          // temp solution for productUpload - NOT SAFE TO USE IN REAL PROJECTS!
          this.userId = authData.id;
          if (this.userId === '62852397eb4f09af1b48e6cf') {
            this.userAdmin = true;
          }
        }
      });
  }

  onLogout() {
    this.authService.logout();
    this.userAdmin = false;
    this.userId = null;
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
    this.userDetailsSub.unsubscribe();
  }
}
