import {Component, OnInit, TemplateRef} from '@angular/core';
import {AppSetup, AppSetupService, TypingComponent} from "@app-global";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

@Component({
    templateUrl: './templates/home.html',
  styleUrls: [`./templates/home.css`],
  standalone: true,
  imports: [
    CommonModule, // Add CommonModule to imports
    FormsModule, RouterModule, TypingComponent
  ]
})
export class HomeView implements OnInit {
  app: AppSetup;
  typingOptions = {
    period: 800,
    info: [ 'IT Consulting Services', 'Digital Solution Provider' ]
  };
  constructor(private setupService: AppSetupService){}
  ngOnInit() { this.app = this.setupService.appSetup; }
  onActivate(componentRef) { }
}
