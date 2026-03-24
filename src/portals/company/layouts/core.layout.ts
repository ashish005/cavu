import {Component} from '@angular/core';
import {AuthService} from "@app-third-party";
import { AppSetupService, AppSetup } from "@app-global";

@Component({
    templateUrl: './core.layout.html',
    styleUrls: ['./company-specific.scss', 'company-theme.scss'],
    standalone: false
})
export class CoreLayout {
  public appSetup: AppSetup;
  constructor(public authService: AuthService, public setupService: AppSetupService){
    this.appSetup = this.setupService.appSetup;
  }
  onActivate(componentRef: any) {}
  login() { this.authService.login(); }
}
