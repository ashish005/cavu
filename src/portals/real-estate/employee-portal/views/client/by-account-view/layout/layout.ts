import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ClientAPIResolver, ClientByIdAPIResolver} from "../services";

@Component({
  standalone: false,
  templateUrl: './templates/layout.html'
})
export class ClientSideNavLayout implements OnInit {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;

    constructor(private router: Router,
                public apiResolver: ClientAPIResolver,
                public clientResolver: ClientByIdAPIResolver,
                public activatedRoute: ActivatedRoute){}

    ngOnInit(){}
    goBack(){
        this.router.navigate(['../manage'], {relativeTo: this.activatedRoute.parent});
    }

    onActivate(componentRef){
      const { accountId } = this.activatedRoute.snapshot.params;
        componentRef.accountId = accountId;
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }

    routerChange(nav){
        this.router.navigate([nav.route], { relativeTo: this.activatedRoute});
    }

    routeToProject(nav){
        this.router.navigate(['./', 'project', nav.id, 'dashboard'], { relativeTo: this.activatedRoute.parent});
    }
}
