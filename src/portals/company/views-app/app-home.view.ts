import {Component, OnInit} from "@angular/core";
import {AppSetup, AppSetupService} from "@app-global";
import {AuthService} from "../../../app";

@Component({
    templateUrl: './templates/home.html',
    standalone: false
})
export class AppHomeView implements OnInit {
    app: AppSetup;
    typingOptions = {
        period: 800,
        info: [ 'IT Consulting Services', 'Digital Solution Provider' ]
    };
    constructor(public authService: AuthService, private setupService: AppSetupService){}
    ngOnInit() { this.app = this.setupService.appSetup; }
    onActivate(componentRef) { }
    login() { this.authService.login(); }
}