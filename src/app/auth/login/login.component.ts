import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isloading = false;
  isordering = false;
  isAuthed = false;
  private authStatusSub: Subscription;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.isAuthed = this.authService.getIsAuthed();
    if (this.isAuthed) {
      this.router.navigate(['/']);
    }
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isloading = false;
      });
  }

  onLogin(form: NgForm) {
    this.isloading = true;
    if (form.invalid) {
      return;
    }
    this.authService.login(
      form.value.email,
      form.value.password,
      this.isordering
    );
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
