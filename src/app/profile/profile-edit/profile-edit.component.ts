import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthData } from 'src/app/auth/auth-data.module';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
})
export class ProfileEditComponent implements OnInit {
  userDetails: AuthData;
  userDetailsSub: Subscription;
  form: FormGroup;

  constructor(private authService: AuthService, private location: Location) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      firstname: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern('^[a-zA-Z ]*$'),
        ],
      }),
      lastname: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern('^[a-zA-Z ]*$'),
        ],
      }),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      address: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      postcode: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern('^[1-9]+[0-9]*$'),
        ],
      }),
      city: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern('^[a-zA-Z ]*$'),
        ],
      }),
    });
    this.userDetails = this.authService.getUserDetails();
    if (!this.userDetails.city) {
      this.userDetails = {
        ...this.userDetails,
        city: '',
      };
    }
    this.form.setValue({
      firstname: this.userDetails.firstname,
      lastname: this.userDetails.lastname,
      email: this.userDetails.email,
      address: this.userDetails.address,
      postcode: this.userDetails.postcode,
      city: this.userDetails.city,
    });
  }

  onSave() {
    this.authService.updateUser(this.form.value);
    this.onCancel();
  }

  onCancel() {
    this.location.back();
  }
}
