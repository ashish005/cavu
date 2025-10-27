import {Component, OnInit, OnDestroy, Input, EventEmitter} from '@angular/core';
import { Subscription } from 'rxjs';
import {
    AlertService, MessageSeverity, DialogType,
    UtilHelper, FuncHelper, AppSetup, AppSetupService
} from "@app-global";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {UserLogin} from "../models/user.model";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-login',
  styles: [`:host { width: 100%;}`],
  templateUrl: './templates/login.html',
  standalone: true,
  imports: [
    CommonModule, // Add CommonModule to imports
    FormsModule, RouterModule
  ]
})

export class LoginView implements OnInit, OnDestroy {
  userLogin = new UserLogin();
  isLoading = false;
  onOk: EventEmitter<boolean> = new EventEmitter<boolean>();

  activeOrg: AppSetup;

  constructor(private alertService: AlertService,
              public setupService: AppSetupService,
              public authService: AuthService) {
      this.activeOrg = this.setupService.appSetup;
  }

  ngOnInit() {}
  ngOnDestroy() { }

  showErrorAlert(caption: string, message: string) {
    this.alertService.showMessage(caption, message, MessageSeverity.error);
  }

  login(userLogin: any) {
    this.isLoading = true;
    this.alertService.startLoadingMessage('', 'Attempting login...');

    const { id } = this.activeOrg || { id: null };
    const userName = `${id}@${this.userLogin.userName}`;

    const successCb = ()=>
    {
        setTimeout(() => {
            this.alertService.stopLoadingMessage();
            this.isLoading = false;
        }, 500);
    };

      const errorCb = error => {
          this.isLoading = false;
          this.alertService.stopLoadingMessage();
          if (UtilHelper.checkNoNetwork(error)) {
              this.alertService.showStickyMessage(UtilHelper.noNetworkMessageCaption, UtilHelper.noNetworkMessageDetail, MessageSeverity.error, error);
              //this.offerAlternateHost();
          } else {
              const errorMessage = UtilHelper.getHttpResponseMessage(error);

              if (errorMessage) {
                  this.userLogin.message = errorMessage;
                  setTimeout(() => {  this.userLogin.message = null; }, 3000);
                  this.alertService.showStickyMessage('Unable to login', this.mapLoginErrorMessage(errorMessage), MessageSeverity.error, error);
              } else {
                  this.alertService.showStickyMessage('Unable to login', 'An error occurred whilst logging in, please try again later.\nError: ' + FuncHelper.stringify(error), MessageSeverity.error, error);
              }
          }
      };
    //this.authService.loginWithPassword(id, userName, userLogin.password, userLogin.rememberMe);//.subscribe(successCb, errorCb);
  }

  mapLoginErrorMessage(error: string) {
    if (error === 'invalid_username_or_password') {
      return 'Invalid username or password';
    }

    if (error === 'invalid_grant') {
      return 'This account has been disabled';
    }

    return error;
  }
}
