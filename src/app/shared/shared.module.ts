import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialsModule } from '../angular-materials.module';
import { LoginComponent } from '../auth/login/login.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialsModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [LoginComponent, LoadingSpinnerComponent],
  exports: [LoginComponent, LoadingSpinnerComponent],
})
export class SharedModule {}
