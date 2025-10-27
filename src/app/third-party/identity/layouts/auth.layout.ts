import {Component, OnInit, TemplateRef} from '@angular/core';
import { AppSetupService, AppSetup } from "@app-global";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {AuthService} from "@app-third-party";

@Component({
    templateUrl: './templates/auth-layout.html', styleUrls: ['./core.scss'],
  standalone: true,
  imports: [
    CommonModule, // Add CommonModule to imports
    FormsModule, RouterModule
  ]
})
export class AuthLayout implements OnInit {
  app: AppSetup;
  constructor(private setupService: AppSetupService, private authService: AuthService){}
  ngOnInit() { this.app = this.setupService.appSetup; }
  onActivate(componentRef) { }
    login(){
    this.authService.login();
    }
}
