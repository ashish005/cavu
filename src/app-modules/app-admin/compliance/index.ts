import {Component, NgModule, OnInit, TemplateRef} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
/*@Component({
    template: `<div class="app-content box-shadow-0" role="main">
    <div class="content-main d-flex flex" id="content-main">
        <div class="d-flex flex">
            <div class="d-flex flex">
                <div class="d-flex flex-column flex">
                    <div class="navbar flex-nowrap white lt box-shadow">
                        <a data-toggle="modal" data-target="#content-aside" data-modal="" class="mr-1 d-md-none">
                            <span class="btn btn-sm btn-icon primary"><i class="fa fa-th"></i></span>
                        </a>
                        <ng-template *ngTemplateOutlet="pageTitleTemplate"></ng-template>
                        <ng-template *ngTemplateOutlet="actionTemplate"></ng-template>
                    </div>
                    <router-outlet (activate)='onActivate($event)'></router-outlet>
                </div>
            </div>
        </div>
    </div>
</div>`
})*/
@Component({
  standalone: false,
  templateUrl: './layout.html'
})
export class ComplianceLayout implements OnInit {
    public actionTemplate: TemplateRef<any>;
    public pageTitleTemplate: TemplateRef<any>;
    public navList = [
        {
            isFLatChildren: true, key: 'compliance',
            children:[
                { routeTo: ['manage'], icon:"fa fa-home", key: 'Compliance' },
                { routeTo: ['manage/regulatory'], icon:"fa fa-home", key: 'Regulatory' },
                { routeTo: ['report'], icon:"fa fa-history", key: 'Report' }
            ]
        }
    ];
    constructor(private router: Router, public activatedRoute: ActivatedRoute){}
    ngOnInit(){}

    onActivate(componentRef){
        this.actionTemplate = componentRef.actionTemplate;
        this.pageTitleTemplate = componentRef.pageTitleTemplate;
    }
}

@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '', component: ComplianceLayout,
                children:[
                    { path: '', pathMatch: 'full', redirectTo:'report' },
                    {
                        path: 'report', data: { translatePath: 'modules.project.manage' },
                        loadChildren: () => import('app-common/compliance/report').then(m => m.ComplianceReportModule)
                    },
                    {
                        path: 'manage', data: { title: 'Compliance', header:'Compliance'},
                        loadChildren: () => import('app-common/compliance/manage').then(m => m.ComplianceManageModule)
                    }
                ]
            }
        ]),
      GlobalModule
    ],
    providers: [],
    declarations: [ComplianceLayout]
})
export class ComplianceModule{}
