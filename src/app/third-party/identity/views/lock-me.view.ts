import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  templateUrl: './templates/lock-me.html'
})
export class CoreLockMeComponent implements OnInit {
  customForm: FormGroup;
  submitted: boolean = false;

  constructor(private router: Router, public fb: FormBuilder) {
    /*this.customForm = this.fb.group({
      username: [, Validators.required],
      password: [null, Validators.required],
      rememberLogin: [null],
      returnUrl: [null]
    });*/
  }

  ngOnInit() {
   /* this.customForm.get('username').setValue(this.authService.currentUser.userName);
    this.customForm.get('rememberLogin').setValue(this.authService.rememberMe);

    this.oauthService.initLoginFlow();*/
  }

  /*onSubmit(){
    this.submitted = true;
    const form = this.customForm.value;

    //this.oauthService.initCodeFlow();

    this.authService.loginWithPassword(form.username, form.password, form.rememberLogin).subscribe(r => {
      console.log('logged in ');
      this.submitted = false;
    }, k=>{
      console.log('error in ');
      this.submitted = false;
    });
  }*/

  unlockMe(){
    /*this.authService.loginWithPassword(null, null, false).subscribe(r => {
      console.log('logged in ');
      this.submitted = false;
    }, k=>{
      console.log('error in ');
      this.submitted = false;
    });*/
  }
}
