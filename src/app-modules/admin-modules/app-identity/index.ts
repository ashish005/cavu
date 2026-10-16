import {ChangeDetectorRef, Component, NgModule, TemplateRef} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router, RouterModule, Routes} from "@angular/router";
import {GlobalModule} from "@app-global";

@Component({
    standalone: false,
    templateUrl: './layout.html',
    styles: [`::ng-deep ng-component{ display: contents;}`],
})
class Layout {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;
    public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'Organisation',
            children: [
                { routeTo: ['org', 'profile'], icon: 'fa fa-institution', key: 'Profile' },
                { routeTo: ['org', 'settings'], icon: 'fa fa-globe', key: 'Regional settings' },
                { routeTo: ['org', 'branding'], icon: 'fa fa-paint-brush', key: 'Branding' },
                { routeTo: ['org', 'features'], icon: 'fa fa-toggle-on', key: 'Features' },
                { routeTo: ['org', 'branches'], icon: 'fa fa-sitemap', key: 'Branches' },
                { routeTo: ['org', 'hosts'], icon: 'fa fa-link', key: 'Host names' }
            ]
        },
        {
            isFLatChildren: true, key: 'Access',
            children: [
                { routeTo: ['access', 'roles'], icon: 'fa fa-shield', key: 'Roles & permissions' },
                { routeTo: ['access', 'members'], icon: 'fa fa-users', key: 'Members' },
                { routeTo: ['access', 'member-types'], icon: 'fa fa-user-circle', key: 'Member types' },
                { routeTo: ['access', 'requirements'], icon: 'fa fa-check-square-o', key: 'Member requirements' },
                { routeTo: ['access', 'dashboards'], icon: 'fa fa-th-large', key: 'Dashboards' }
            ]
        },
        {
            isFLatChildren: true, key: 'Integrations',
            children: [
                { routeTo: ['integrations', 'messaging'], icon: 'fa fa-envelope', key: 'Messaging' },
                { routeTo: ['integrations', 'payments'], icon: 'fa fa-credit-card', key: 'Payment gateways' },
                { routeTo: ['integrations', 'webhooks'], icon: 'fa fa-plug', key: 'Webhooks' },
                { routeTo: ['integrations', 'activity'], icon: 'fa fa-history', key: 'Activity' }
            ]
        },
        {
            name: "Others", isFLatChildren: true,
            children: [
                { routeTo: ['quiz'], icon: "fa fa-question-circle", key: 'Quiz' }
            ]
        }
    ];
    constructor(public router: Router, public activatedRoute: ActivatedRoute, public cdref: ChangeDetectorRef){}
    ngAfterContentChecked(){ this.cdref.detectChanges(); }
    onActivate(componentRef) {
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }
}

const SETUP_ROOT = '/app/admin/setup';

/** Routes of retired screens: known sub-paths go to their replacement, anything else to the area's main page. */
function legacyRedirects(map: Record<string, string>, fallback: string): Routes {
    return [
        {path: '', pathMatch: 'full', redirectTo: `${SETUP_ROOT}/${fallback}`},
        ...Object.entries(map).map(([from, to]) => ({path: from, redirectTo: `${SETUP_ROOT}/${to}`})),
        {path: '**', redirectTo: `${SETUP_ROOT}/${fallback}`}
    ];
}

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '', component: Layout,
                data: {code: 'ORG', title: 'Organisation', header: 'Organisation'},
                children: [
                    {path: '', pathMatch: 'full', redirectTo: 'org/profile'},
                    // Earlier screens (served by the identity server) now live in org-admin; old links land on their replacements.
                    {path: 'org-setup', children: legacyRedirects({'general/branch': 'org/branches', 'general/host': 'org/hosts',
                            'general/brand-image': 'org/branding', 'general/office': 'org/settings', 'config': 'org/settings', 'features': 'org/features'}, 'org/profile')},
                    {path: 'role-permission-setup', children: legacyRedirects({'users': 'access/members', 'contact': 'access/members'}, 'access/roles')},
                    {path: 'module-access-setup', children: legacyRedirects({'user-type': 'access/member-types', 'dashboard': 'access/dashboards'}, 'access/requirements')},
                    {path: 'integration', children: legacyRedirects({'payment': 'integrations/payments'}, 'integrations/messaging')},
                    {
                        path: 'quiz',
                        loadChildren: () => import('app-modules/app-admin/quiz/index').then(r => r.QuizModule),
                        data: {title: 'Quiz', header: 'Quiz'}
                    },
                    // Profile, settings, branding, features, roles, members, integrations (tenant API v1/org-admin).
                    {
                        path: '',
                        loadChildren: () => import('./org-admin/org-admin.module').then(m => m.OrgAdminModule)
                    }
                ]
            }
        ]),
        GlobalModule
    ],
    declarations: [Layout]
})

export class OrgIdentitySetupModule {
}