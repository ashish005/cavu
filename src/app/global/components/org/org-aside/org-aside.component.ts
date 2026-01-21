import {
    Component,
    EventEmitter,
    Input, OnInit,
    Output
} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {AuthService} from "@app-third-party";
import {CommonModule} from "@angular/common";
import {OrgLogoComponent} from "../org-logo/org-logo.component";
import {ThemeManagerService} from "../../../modules/theme-setting/services/theme-manager.service";

@Component({
  selector: 'org-aside',
  templateUrl:'./org-aside.html',
  //styles: [`:host{ display: contents; }`]
  standalone: true,
  imports: [ CommonModule, RouterModule, OrgLogoComponent ]
})
export class OrgAsideComponent {
    @Input() showInbox: boolean | string = false;
    public navList: Array<any>;
    @Input() set data(val: Array<any>){
        this.navList = val || [];
    };
  //activeFragment: any;
  constructor(public router: Router,
              public activatedRoute: ActivatedRoute,
              public authService: AuthService,
              public themeManager: ThemeManagerService){
    //this.activeFragment = this.route.fragment.pipe(share());
  }

  //routeToUrl=(item)=> this.router.navigate(item.routeTo, { relativeTo: this.activatedRoute.parent });

  signout = () => this.authService.logout();

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
}
