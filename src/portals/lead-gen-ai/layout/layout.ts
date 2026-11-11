import {ChangeDetectorRef, Component, Injector, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router, RouterLink, RouterModule} from "@angular/router";
import { AppPermissionService, OrgLookupService, OrgLookup } from "@app-global";
import { LeadGenApiService, Workspace } from "../services/lead-gen-api.service";
import { WorkspaceContextService } from "../services/workspace-context.service";

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
  workspaces: Workspace[] = [];
  scopeOptions: { value: string; label: string; workspaceId: string; clientBusinessId: string }[] = [];
  selectedScope = '';

  constructor(public router: Router, public activatedRoute: ActivatedRoute,
              public cdref: ChangeDetectorRef,
              public permService: AppPermissionService, public lookupService: OrgLookupService,
              private readonly api: LeadGenApiService,
              private readonly workspaceContext: WorkspaceContextService){
      this.orgLookup = this.lookupService.getOrgLookup();
  }

  ngOnInit() {
    this.api.listWorkspaces().subscribe({
      next: (ws) => {
        this.workspaces = ws;
        this.scopeOptions = ws.flatMap(w =>
          (w.clientBusinesses ?? []).map(b => ({
            value: `${w.id}:${b.id}`,
            label: ws.length > 1 ? `${w.name} / ${b.name}` : b.name,
            workspaceId: w.id,
            clientBusinessId: b.id
          })));
        const current = this.workspaceContext.current;
        if (current) this.selectedScope = `${current.workspaceId}:${current.clientBusinessId}`;
        else if (this.scopeOptions.length) this.onScopeChange(this.scopeOptions[0].value);
      },
      error: () => undefined
    });
  }

  onScopeChange(value: string): void {
    this.selectedScope = value;
    const opt = this.scopeOptions.find(o => o.value === value);
    if (opt) this.workspaceContext.setActive({ workspaceId: opt.workspaceId, clientBusinessId: opt.clientBusinessId });
  }

    onActivate(componentRef){}
    ngAfterContentChecked() { this.cdref.detectChanges(); }

    routeToUrl=(path)=> this.router.navigate([path], {relativeTo: this.activatedRoute});
}
