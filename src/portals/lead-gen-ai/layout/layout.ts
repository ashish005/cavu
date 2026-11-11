import {ChangeDetectorRef, Component, Injector, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router, RouterLink, RouterModule} from "@angular/router";
import { AppPermissionService, OrgLookupService, OrgLookup } from "@app-global";

@Component({
  templateUrl: './templates/layout.html',
  standalone: false,
  styles: [`::ng-deep ng-component{ display: contents;}`]
})
export class MainLayout implements OnInit {
  public navList: Array<any> = this.permService.getEmployeeNavList([
    {
      isFLatChildren: true, key: 'mainLayout.heading.main',
      children:[
        { routeTo: ['dashboard'], icon:"fa fa-dashboard", key: 'dashboard' },
        { routeTo: ['setup'], icon:"fa fa-magic", key: 'setup' },
        { routeTo: ['leads'], icon:"fa fa-users", key: 'leads' },
        { routeTo: ['operations'], icon:"fa fa-bell", key: 'operations' },
        { routeTo: ['candidate'], icon:"fa fa-briefcase", key: 'candidate' }
      ]
    }
  ]);

  orgLookup: OrgLookup;
  constructor(public router: Router, public activatedRoute: ActivatedRoute,
              public cdref: ChangeDetectorRef,
              public permService: AppPermissionService, public lookupService: OrgLookupService){
      this.orgLookup = this.lookupService.getOrgLookup();
  }

  ngOnInit() {}

    onActivate(componentRef){}
    ngAfterContentChecked() { this.cdref.detectChanges(); }

    routeToUrl=(path)=> this.router.navigate([path], {relativeTo: this.activatedRoute});
}
