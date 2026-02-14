import {Component, NgModule, OnInit, TemplateRef} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        RouterModule.forChild([
            { path: '', pathMatch: 'full', redirectTo:'manage' },
            {
                path: 'report', data: { translatePath: 'modules.project.manage' },
                loadChildren: () => import('./report').then(m => m.ComplianceReportModule)
            },
            {
                path: 'manage', data: { title: 'Compliance', header:'Compliance'},
                loadChildren: () => import('./manage').then(m => m.ComplianceManageModule)
            }
        ]),
        GlobalModule
    ],
    providers: []
})
export class ComplianceModule{}