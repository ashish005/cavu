import {ChangeDetectorRef, Component, Injector, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router, RouterLink, RouterModule} from "@angular/router";
import { AppPermissionService, OrgLookupService, OrgLookup } from "@app-global";
import { LeadGenApiService, Workspace } from "../../services/lead-gen-api.service";
import { WorkspaceContextService } from "../../services/workspace-context.service";

@Component({
  templateUrl: './templates/layout.html',
  standalone: false,
  styles: [`
    ::ng-deep ng-component{ display: contents;}

    /* Lead-gen theme — spec: blue #2457D6, bg #F7F8FA, white cards, Inter */
    #content-main {
      background: #F7F8FA;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    #content-main ::ng-deep .card,
    #content-main ::ng-deep .empty-state,
    #content-main ::ng-deep .launch-option,
    #content-main ::ng-deep .pack-card,
    #content-main ::ng-deep .report-card {
      background: #fff;
      border: 1px solid #E6E8EC;
      border-radius: 12px;
      box-shadow: 0 1px 2px rgba(16,24,40,.04);
    }
    #content-main ::ng-deep .btn-primary {
      background: #2457D6;
      border-radius: 8px;
      font-weight: 600;
    }
    #content-main ::ng-deep .btn-primary:hover:not(:disabled) { background: #1D46B8; }
    #content-main ::ng-deep .btn-secondary {
      border: 1px solid #D9DCE1;
      border-radius: 8px;
      color: #344054;
    }
    #content-main ::ng-deep input, #content-main ::ng-deep select, #content-main ::ng-deep textarea {
      border: 1px solid #D9DCE1;
      border-radius: 8px;
      font-family: inherit;
    }
    #content-main ::ng-deep input:focus, #content-main ::ng-deep select:focus, #content-main ::ng-deep textarea:focus {
      border-color: #2457D6;
      box-shadow: 0 0 0 3px rgba(36,87,214,.12);
      outline: none;
    }
    #content-main ::ng-deep table { border-collapse: collapse; width: 100%; }
    #content-main ::ng-deep th { font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: #667085; font-weight: 600; }
    #content-main ::ng-deep td, #content-main ::ng-deep th { padding: 10px 12px; border-bottom: 1px solid #EAECF0; }
    #content-main ::ng-deep h1, #content-main ::ng-deep h2 { color: #101828; letter-spacing: -0.01em; }
  `]
})
export class MainLayout implements OnInit {
  public navList: Array<any> = this.permService.getEmployeeNavList([
    {
      isFLatChildren: true, key: 'mainLayout.heading.main',
      children:[
        { routeTo: ['dashboard'], icon:"fa fa-dashboard", key: 'overview' },
        { routeTo: ['leads'], icon:"fa fa-users", key: 'contactsLeads' },
        { routeTo: ['conversations'], icon:"fa fa-comments", key: 'conversations' },
        { routeTo: ['appointments'], icon:"fa fa-calendar", key: 'appointments' },
        { routeTo: ['agents'], icon:"fa fa-robot", key: 'aiAgents' },
        { routeTo: ['workflows'], icon:"fa fa-random", key: 'workflows' },
        { routeTo: ['voice-ai'], icon:"fa fa-phone", key: 'voiceAi' },
        { routeTo: ['campaigns'], icon:"fa fa-bullhorn", key: 'campaigns' },
        { routeTo: ['prospecting'], icon:"fa fa-search", key: 'prospecting' },
        { routeTo: ['analytics'], icon:"fa fa-chart-line", key: 'analytics' },
        { routeTo: ['integrations'], icon:"fa fa-plug", key: 'integrations' },
        { routeTo: ['billing'], icon:"fa fa-credit-card", key: 'billing' },
        { routeTo: ['operations'], icon:"fa fa-sliders", key: 'operations' },
        { routeTo: ['setup'], icon:"fa fa-cog", key: 'settings' },
        { routeTo: ['candidate'], icon:"fa fa-briefcase", key: 'candidate' },
        { routeTo: ['team'], icon:"fa fa-user-shield", key: 'team' },
        { routeTo: ['help'], icon:"fa fa-question-circle", key: 'help' }
      ]
    }
  ]);

  orgLookup: OrgLookup;
  workspaces: Workspace[] = [];
  scopeOptions: { value: string; label: string; workspaceId: string; clientBusinessId: string }[] = [];
  selectedScope = '';
  darkMode = false;

  constructor(public router: Router, public activatedRoute: ActivatedRoute,
              public cdref: ChangeDetectorRef,
              public permService: AppPermissionService, public lookupService: OrgLookupService,
              private readonly api: LeadGenApiService,
              private readonly workspaceContext: WorkspaceContextService){
      this.orgLookup = this.lookupService.getOrgLookup();
  }

  ngOnInit() {
    this.darkMode = localStorage.getItem('leadgen-theme') === 'dark';
    this.applyTheme();
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

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('leadgen-theme', this.darkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.darkMode ? 'dark' : 'light');
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
