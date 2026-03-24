import {Component, OnInit, TemplateRef} from '@angular/core';
import {AppSetup, AppSetupService, TypingComponent} from "@app-global";

@Component({
  templateUrl: './templates/home.html',
  standalone: false
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
