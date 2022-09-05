import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CustomValidationService } from 'src/app/shared/custom-validators/custom-validation.service';

@Component({
  selector: 'app-profile-password',
  templateUrl: './profile-password.component.html',
  styleUrls: ['./profile-password.component.css'],
})
export class ProfilePasswordComponent implements OnInit {
  form: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private customValidator: CustomValidationService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup(
      {
        oldpassword: new FormControl(null, {
          validators: [Validators.required],
        }),
        newpassword: new FormControl(null, {
          validators: [Validators.required, Validators.minLength(8)],
        }),
        confirmpassword: new FormControl(null, {
          validators: [Validators.required, Validators.minLength(8)],
        }),
      },
      {
        // validator working fine, error message not shown??
        validators: this.customValidator.passwordMatchValidator(
          'newpassword',
          'confirmpassword'
        ),
      }
    );
  }

  onPasswordChange() {
    this.authService.changePassword(
      this.oldpassword.value,
      this.newpassword.value,
      this.confirmpassword.value
    );
  }

  onCancel() {
    this.router.navigate(['/profile']);
  }

  get oldpassword() {
    return this.form.get('oldpassword');
  }
  get newpassword() {
    return this.form.get('newpassword');
  }
  get confirmpassword() {
    return this.form.get('confirmpassword');
  }
}
