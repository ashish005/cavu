import {Component, Injector, Input, OnInit} from "@angular/core";
import {ActivatedRoute, Router, RouterLink, RouterModule} from "@angular/router";
import {AuthService} from "@app-third-party";
import {Subscription, Observable} from "rxjs";
import {CommonModule} from "@angular/common";
import {AppSetupService} from "../../../services";
import {AppSetup} from "../../../services/models";

@Component({
    selector: 'org-header',
    templateUrl: './org-header.html',
    standalone: true,
  imports: [CommonModule, RouterLink, RouterModule]
})
export class OrgHeaderComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  appSetup!: AppSetup;
  orgOptions!: any;
  orgLookup!: any;
    constructor(public injector: Injector, public appSetupService: AppSetupService,
                public router: Router, public activatedRoute: ActivatedRoute,
                private authService: AuthService) {
      this.isAuthenticated$ = authService.isAuthenticated$;
    }

    ngOnInit() {
      this.appSetup = this.appSetupService.appSetup;
    }

    routeToSupportPortal = (path) => this.router.navigate(['support', path], {relativeTo: this.activatedRoute.parent});
    routeToPath = (path) => this.router.navigate([path], {relativeTo: this.activatedRoute.parent});
    routeToSetupPath = (path) => this.router.navigate(['setup', path], {relativeTo: this.activatedRoute.parent});

    logout = () => this.authService.logout();

    get email(): string {
      return this.authService.identityClaims
        ? (this.authService.identityClaims as any)['email']
        : '-';
    }

    get initials(): string {
      //const name = this.currentUser?.userName?.split(' ') || [];
      const name = 'A C';
      let _name = '';
      if (name?.length > 0) {
        _name = name[0][0];
        if (name[1] && name[1][0]) {
          _name += ' ' + name[1][0];
        }
      }
      return _name;
    }

  routeToUrl=(path)=> this.router.navigate([path], {relativeTo: this.activatedRoute});

    // showBellPopup = () => this.coreService.showBellPopup();
    showBellPopup = () => null;
    // createSupportTicket = () => this.coreService.createSupportTicket();
    createSupportTicket = () => null;
    // showSurveyPopup = () => this.coreService.showSurveyPopup();
    updateLanguage = (lan) => null;
    // showGlobalFilterPopup = () => this.coreService.showGlobalFilterPopup();
    showGlobalFilterPopup = () => null;
    // updateAppSession = (session) => this.coreService.updateAppSession(session);
    updateAppSession = (session) => null;
    toggleThemeSwitcher = () => null;
    // toggleThemeSwitcher = () => this.coreService.toggleThemeSwitcher();
}
