import {ChangeDetectorRef, Component, Injector, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute, Router, RouterLink, RouterModule} from "@angular/router";
import { AppPermissionService, OrgLookupService, OrgLookup } from "@app-global";
import { AiStudioService } from "../../features/ai-studio/ai-studio.service";

@Component({
  templateUrl: './templates/layout.html',
  standalone: false,
  styles: [`
    .studio-search{padding:6px 10px;border-radius:8px;border:1px solid var(--st-border,#dfe3ee);background:transparent;color:inherit;font-size:12px;min-width:220px}
    .studio-switch{padding:5px 8px;border-radius:8px;border:1px solid var(--st-border,#dfe3ee);background:transparent;color:inherit;font-size:12px;max-width:170px}
    .jump-results{position:absolute;top:110%;left:0;right:0;background:var(--st-card,#fff);border:1px solid var(--st-border,#e6e9f2);border-radius:8px;box-shadow:0 8px 24px rgba(15,23,42,.12);z-index:50;overflow:hidden;min-width:300px}
    .jump-results a{display:flex;justify-content:space-between;gap:10px;padding:8px 12px;cursor:pointer;font-size:12px;color:inherit;text-decoration:none}
    .jump-results a:hover{background:rgba(52,103,214,.08)}
    .jr-label{font-weight:600}.jr-hint{opacity:.6}
    .client-override{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:0 12px 8px;padding:8px 14px;border-radius:8px;background:#fff4e5;border:1px solid #f5d9a8;color:#8a5a00;font-size:13px}
  `]
})
export class MainLayout implements OnInit {
  get workspaces() { return this.studio.workspaceList; }
  get industries() { return this.studio.industryList; }
  navList: Array<any> = [];
  orgLookup: OrgLookup;
  darkMode = false;
  q = ''; qResults: any[] = []; toasts: string[] = []; pageTitle = 'Command Center';

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
    this.router.events.subscribe(() => {
      const url = this.router.url; const seg = url.split('/').filter(Boolean).pop() ?? 'command-center';
      this.pageTitle = seg.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
    });
    this.studio.workspace$.subscribe(() => {
      this.buildNav();
      const k=this.studio.workspace?.key;
      if(k) this.router.navigate([k, 'command-center'], {relativeTo: this.activatedRoute});
    });
  }

  buildNav() {
    const wsId = this.studio.workspace?.key ?? "business-growth";
    const R = (path: string, icon: string, key: string) => ({ routeTo: [wsId, path], icon: `fa fa-${icon}`, key });
    // Spec: 7 primary routes grouped Overview / Growth & Operations / AI & Platform / Settings
    const extra = this.studio.workspace?.key === 'agency-operations' || this.studio.workspace?.key === 'platform-admin';
    this.navList = [{
      isFLatChildren: true, key: 'mainLayout.heading.main',
      children: [
        R('command-center', 'dashboard', 'Command Center'),
        R('discovery', 'search', 'Discovery Studio'),
        R('entities', 'database', 'Entities & Intelligence'),
        R('pipelines', 'columns', 'Pipelines & Schedule'),
        R('inbox', 'comments', 'Inbox & Voice'),
        R('automation', 'cogs', 'AI Workforce & Flows'),
        R('analytics', 'bar-chart', 'Analytics'),
        R('settings', 'sliders', 'Settings'),
        R('operations', 'wrench', 'Operations'),
      ].filter(i => extra || !['analytics','settings'].includes(String(i.routeTo[1])) || true)
    }];
  }

  switchWorkspace(id: string) { this.studio.setWorkspace(id as any); }
  switchIndustry(key: string) { this.studio.setIndustry(key); }
  resetStudio() { this.studio.reset(); }
  get clientOverride() { return this.studio.clientOverride; }
  exitOverride() { this.studio.exitClientOverride(); }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('leadgen-theme', this.darkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.darkMode ? 'dark' : 'light');
  }

    onActivate(componentRef){}
    quickFilter() {
      const q = this.q.toLowerCase();
      if (!q) { this.qResults = []; return; }
      const ws = this.studio.workspace?.key ?? 'business-growth';
      this.qResults = [
        ...this.studio.entities$.value.filter(e => e.name.toLowerCase().includes(q)).slice(0,4).map(e => ({ label: e.name, hint: `Entity · ${e.classification} · ${e.score}`, route: [ws, 'entities'] })),
        ...this.studio.agents$.value.filter(a => a.name.toLowerCase().includes(q)).slice(0,3).map(a => ({ label: a.name, hint: 'AI Agent', route: [ws, 'automation'] })),
        ...this.studio.workflows$.value.filter(w => w.name.toLowerCase().includes(q)).slice(0,3).map(w => ({ label: w.name, hint: 'Workflow', route: [ws, 'automation'] })),
      ].slice(0, 8);
    }
    go(r: any) { this.q = ''; this.qResults = []; this.router.navigate(r.route, { relativeTo: this.activatedRoute }); }
    toast(msg: string) { this.toasts.push(msg); setTimeout(() => this.toasts = this.toasts.slice(1), 3000); }
    ngAfterContentChecked() { this.cdref.detectChanges(); }

    routeToUrl=(path)=> this.router.navigate([path], {relativeTo: this.activatedRoute});
}
