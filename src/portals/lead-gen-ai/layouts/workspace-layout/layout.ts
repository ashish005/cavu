import {ChangeDetectorRef, Component, Injector, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router, RouterLink, RouterModule} from "@angular/router";
import { AppPermissionService, OrgLookupService, OrgLookup } from "@app-global";
import { AiStudioService } from "../../features/ai-studio/ai-studio.service";

@Component({
  templateUrl: './templates/layout.html',
  standalone: false
})
export class MainLayout implements OnInit {
  get workspaces() { return this.studio.workspaceList; }
  get industries() { return this.studio.industryList; }
  navList: Array<any> = [];
  orgLookup: OrgLookup;
  darkMode = false;

  constructor(public router: Router, public activatedRoute: ActivatedRoute,
              public cdref: ChangeDetectorRef,
              public permService: AppPermissionService, public lookupService: OrgLookupService,
              public studio: AiStudioService){
      this.orgLookup = this.lookupService.getOrgLookup();
  }

  get wsRoutes() { return this.studio.workspace?.routes ?? []; }

  ngOnInit() {
    this.darkMode = localStorage.getItem('leadgen-theme') === 'dark';
    this.applyTheme();
    this.buildNav();
    this.studio.workspace$.subscribe(() => {
      this.buildNav();
      const k=this.studio.workspace?.key;
      if(k) this.router.navigate([k, 'command-center'], {relativeTo: this.activatedRoute});
    });
  }

  buildNav() {
    const wsId = this.studio.workspace?.key ?? "business-growth";
    this.navList = [{
      isFLatChildren: true, key: 'mainLayout.heading.main',
      children: [
        ...this.wsRoutes.map(r => ({ routeTo: [wsId, r.path], icon: `fa fa-${r.icon}`, key: r.label })),
        { routeTo: [wsId, 'operations'], icon: 'fa fa-cogs', key: 'Operations' }
      ]
    }];
  }

  switchWorkspace(id: string) { this.studio.setWorkspace(id as any); }
  switchIndustry(key: string) { this.studio.setIndustry(key); }
  resetStudio() { this.studio.reset(); }

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
