import {Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  templateUrl: './templates/register.html',
  standalone: true,
  imports: [
    CommonModule, // Add CommonModule to imports
    ReactiveFormsModule
  ],
})
export class RegisterView{
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      username: ['', Validators.required],
      mobile: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    const _user = this.registerForm.value;
    /*this.coreService.register(_user.email, _user.username, _user.mobile ,_user.password)
      .pipe(first())
      .subscribe(
        data => {
          if(data.isSuccess){
            this.alertService.showMessage('Registration successful');
            this.router.navigate(['/auth/login']);
          }
          this.alertService.showMessage('Registration failed. Please contact helpdesk...');
        },
        error => {
          this.alertService.showDialog('Something went wrong. If the problem persist, Please connect with helpdesk...').error(error);
          this.loading = false;
        });*/
  }
}
