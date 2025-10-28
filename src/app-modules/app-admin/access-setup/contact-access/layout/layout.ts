import {Component, Injector, OnDestroy, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {forkJoin, take, filter} from "rxjs";
import {UserAccessSetupAPIResolver} from "../services/api.resolver";
import {AccessSetupUserType} from "../domains/lookup.serializer";

@Component({
    standalone: false,
  templateUrl: './templates/layout.html'
})
export class Layout implements OnInit, OnDestroy {
    public viewNavigations: any = [
        { name: 'Dashboard', sortOrder: 1, route: 'dashboard'},
        { name: 'Document Type', sortOrder: 2, route: 'document-type'},
        //{ name: 'Notification', sortOrder: 3, route: 'notification'},
        { name: 'Address Type', sortOrder: 4, route: 'address-type'},
        { name: 'Contact Type', sortOrder: 5, route: 'contact-type'},
        { name: 'Relation Type', sortOrder: 6, route: 'relation-type'}
    ];

  @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
  public userMasterType: string;
  constructor(public injector: Injector, public router: Router, public activatedRoute: ActivatedRoute,
              public lookupResolver: UserAccessSetupAPIResolver) {
  }
  ngOnInit() {}

  ngOnDestroy() {}

    onActivate(componentRef) {
        //this.userMasterType = componentRef.activatedRoute.snapshot.data.userType;
        this.actionTemplate = componentRef.actionTemplate;
    }

    routeToUserTypeView(userType: AccessSetupUserType)
    {
        const str = '/contact-access/';
        const segs = this.router.routerState.snapshot.url.split(str);
        let url = segs[1]?.split('/');
        url[0] = userType.masterType;
        this.router.navigate(url, { relativeTo: this.activatedRoute });
    }
}