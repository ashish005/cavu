import {Component, DestroyRef, NgModule, OnInit, TemplateRef, inject} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ActivatedRoute, Router, RouterModule, Routes} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AsidePanelComponent, GlobalModule} from "@app-global";
import {EXPENSE_SERVICES, ExpenseApiService} from "./expense-api.service";
import {ExpenseClaimsView} from "./views/claims.view";
import {ExpenseClaimEditorComponent} from "./views/claim-editor.component";
import {ExpenseClaimDetailComponent} from "./views/claim-detail.component";
import {ExpensePaymentsView} from "./views/payments.view";
import {ExpenseSpendView} from "./views/spend.view";
import {ExpenseSettingsView} from "./views/expense-settings.view";

interface NavItem { label: string; icon: string; route: string; }
interface NavSection { title: string; items: NavItem[]; }

/**
 * Office expenses (portal route `office-expense`, tenant API api/v1/expenses): my claims for everyone with an employee
 * record; approvals for managers; posting, reimbursing, advances, the spend report and settings for finance.
 */
@Component({
    selector: 'expense-shell',
    standalone: false,
    template: `
        <div class="d-flex flex" style="min-width: 0">
            <nav class="d-none d-md-flex flex-column b-r light lt" style="width: 200px; min-width: 200px">
                <div class="scroll-y py-2">
                    <ng-container *ngFor="let s of nav">
                        <div class="px-3 pt-2 pb-1 text-xs text-muted text-uppercase">{{ s.title }}</div>
                        <a *ngFor="let i of s.items" class="d-block px-3 py-1 text-sm exp-nav-link" [routerLink]="i.route" routerLinkActive="active _600"><i [class]="i.icon" class="fa-fw mr-1 text-muted"></i>{{ i.label }}</a>
                    </ng-container>
                </div>
            </nav>
            <div class="d-flex flex-column flex" style="min-width: 0">
                <div class="navbar flex-nowrap white lt box-shadow px-3">
                    <select class="form-control form-control-sm d-md-none mr-2" style="max-width: 160px" (change)="go($any($event.target).value)">
                        <ng-container *ngFor="let s of nav"><optgroup [label]="s.title"><option *ngFor="let i of s.items" [value]="i.route">{{ i.label }}</option></optgroup></ng-container>
                    </select>
                    <ng-container *ngTemplateOutlet="titleTemplate"></ng-container>
                    <span class="flex"></span>
                    <ng-container *ngTemplateOutlet="actionTemplate"></ng-container>
                </div>
                <div class="d-flex flex" style="min-height: 0"><router-outlet (activate)="onActivate($event)"></router-outlet></div>
            </div>
        </div>`,
    styles: [`:host { display: flex; flex: 1 1 auto; min-width: 0; } ::ng-deep ng-component { display: contents; }
        .exp-nav-link { color: inherit; border-left: 3px solid transparent; } .exp-nav-link.active { border-left-color: currentColor; background: rgba(120,130,140,.08); }
        .exp-nav-link:hover { background: rgba(120,130,140,.06); text-decoration: none; }`]
})
export class ExpenseShell implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    titleTemplate: TemplateRef<any> | null = null;
    actionTemplate: TemplateRef<any> | null = null;
    /** What the caller may use; refined once the lookups arrive. */
    nav: NavSection[] = [{title: 'My expenses', items: [{label: 'My claims', icon: 'fa fa-file-text-o', route: 'mine'}]}];

    constructor(private api: ExpenseApiService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        this.api.lookups().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: l => {
                const nav: NavSection[] = [{title: 'My expenses', items: [{label: 'My claims', icon: 'fa fa-file-text-o', route: 'mine'}]}];
                if (l.isManager || l.canFinance) { nav.push({title: 'Approvals', items: [{label: 'To approve', icon: 'fa fa-check-square-o', route: 'approvals'}]}); }
                if (l.canFinance || l.canViewAll) {
                    nav.push({title: 'Finance', items: [
                        ...(l.canFinance ? [{label: 'To post and reimburse', icon: 'fa fa-inbox', route: 'finance'}] : []),
                        {label: 'All claims', icon: 'fa fa-list', route: 'all'},
                        {label: 'Payments and advances', icon: 'fa fa-money', route: 'payments'},
                        {label: 'Spend report', icon: 'fa fa-bar-chart', route: 'report'},
                        ...(l.canFinance ? [{label: 'Settings', icon: 'fa fa-cog', route: 'settings'}] : [])
                    ]});
                }
                this.nav = nav;
            },
            error: () => {}
        });
    }

    onActivate(view: any) {
        this.titleTemplate = view?.pageTitleTemplate ?? null;
        this.actionTemplate = view?.actionTemplate ?? null;
    }

    go(path: string) { this.router.navigate([path], {relativeTo: this.route}); }
}

const routes: Routes = [{
    path: '', component: ExpenseShell,
    children: [
        {path: '', pathMatch: 'full', redirectTo: 'mine'},
        {path: 'mine', component: ExpenseClaimsView, data: {scope: 'mine', title: 'My expense claims'}},
        {path: 'approvals', component: ExpenseClaimsView, data: {scope: 'team', title: 'Claims to approve'}},
        {path: 'finance', component: ExpenseClaimsView, data: {scope: 'finance', title: 'To post and reimburse'}},
        {path: 'all', component: ExpenseClaimsView, data: {scope: 'all', title: 'All expense claims'}},
        {path: 'payments', component: ExpensePaymentsView, data: {title: 'Payments and advances'}},
        {path: 'report', component: ExpenseSpendView, data: {title: 'Spend report'}},
        {path: 'settings', component: ExpenseSettingsView, data: {title: 'Expense settings'}},
        // Links of the screens this replaced (and notification links `?claim=`) land on my claims.
        {path: '**', redirectTo: 'mine'}
    ]
}];

@NgModule({
    imports: [CommonModule, FormsModule, RouterModule.forChild(routes), GlobalModule, AsidePanelComponent],
    providers: [EXPENSE_SERVICES],
    declarations: [ExpenseShell, ExpenseClaimsView, ExpenseClaimEditorComponent, ExpenseClaimDetailComponent, ExpensePaymentsView, ExpenseSpendView, ExpenseSettingsView]
})
export class ExpenseModule {}
