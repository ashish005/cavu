import {ChangeDetectorRef, Component, Injector, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router, RouterLink, RouterModule} from "@angular/router";
import { AppPermissionService, OrgLookupService, OrgLookup } from "@app-global";

@Component({
  templateUrl: './templates/layout.html',
  standalone: false
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
  scopeOptions: { value: string; label: string; workspaceId: string; clientBusinessId: string }[] = [];
  selectedScope = '';
  darkMode = false;

  constructor(public router: Router, public activatedRoute: ActivatedRoute,
              public cdref: ChangeDetectorRef,
              public permService: AppPermissionService, public lookupService: OrgLookupService){
      this.orgLookup = this.lookupService.getOrgLookup();
  }

  ngOnInit() {
    this.darkMode = localStorage.getItem('leadgen-theme') === 'dark';
    this.applyTheme();
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('leadgen-theme', this.darkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.darkMode ? 'dark' : 'light');
  }

    onActivate(componentRef){}
    ngAfterContentChecked() { this.cdref.detectChanges(); }

    routeToUrl=(path)=> this.router.navigate([path], {relativeTo: this.activatedRoute});
}
