import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";

import {CommonModule} from "@angular/common";
import {fadeInOut} from "@app-global";

@Component({
  templateUrl: './templates/forgot-password.html',
  animations: [fadeInOut],
  standalone: true,
  imports: [
    CommonModule, // Add CommonModule to imports
    ReactiveFormsModule, RouterModule
  ]
})
export class ForgotPasswordView {
    customForm: FormGroup;
    submitted: boolean = false;
    message: string;
  constructor(public fb: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router) {
      this.customForm = this.fb.group({
          email: [null, Validators.required]
      });
  }
    submitForm(form: FormGroup) {
      if(form.invalid){
          return;
      }
      // this.coreService.sendForgetPasswordLink(form.getRawValue().email).subscribe((r: any) => {
      //     this.router.navigate(['password-generated', this.activatedRoute.parent]);
      // });
        this.router.navigate(['password-confirmation']);
    }
}
