import {Component} from '@angular/core';
import {RouterModule} from "@angular/router";
import {AuthService} from "@app-third-party";
import { AppSetupService, AppSetup } from "@app-global";

@Component({
    templateUrl: './core.layout.html',
    styleUrls: ['./core.scss'],
    standalone: true,
    imports: [RouterModule]
})
export class CoreLayout {
  public appSetup: AppSetup;
  constructor(public authService: AuthService, public setupService: AppSetupService){
    this.appSetup = this.setupService.appSetup;
  }
  onActivate(componentRef: any) {}
  login() { this.authService.login(); }
}
