import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  isloading = false;
  authStatusSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((res) => {
        this.isloading = false;
      });
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isloading = true;
    this.authService.createUser(
      form.value.firstname,
      form.value.lastname,
      form.value.address,
      form.value.postcode,
      form.value.city,
      form.value.email,
      form.value.password
    );
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
