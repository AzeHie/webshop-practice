import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthData } from '../auth/auth-data.module';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  userDetails: AuthData;
  userDetailsSub: Subscription;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.userDetailsSub = this.authService
      .getUserUpdateListener()
      .subscribe((authData) => {
        this.userDetails = authData;
      });
  }

  onEdit() {
    this.router.navigate(['/profile/edit']);
  }

  ngOnDestroy(): void {
    this.userDetailsSub.unsubscribe();
  }
}
