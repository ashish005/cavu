import {Component, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

@Component({ templateUrl: './layout.html', standalone: false })
export class Layout {
    public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'mainLayout.heading.main',
            children:[
                { routeTo: ['setup/config'], icon:"fa fa-envelope", key: 'Manage Team' },
                { routeTo: ['setup/manage'], icon:"fa fa-envelope", key: 'Team Setup' },
                /*{ routeTo: ['others/category'], icon:"fa fa-envelope", key: 'Manage Category' },
                { routeTo: ['others/setup-rules'], icon:"fa fa-envelope", key: 'Setup Rules' }*/
            ]
        }
    ];
    constructor(){}
    onActivate(componentRef: any){}
}

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '', component: Layout,
                children:[
                    {path: '', redirectTo: 'setup/manage', pathMatch: 'full'},
                    {
                        path: 'setup',
                        loadChildren: () => import('app-modules/app-admin/team-setup/manage/index').then(m => m.TeamSetupModule),
                        data: { key:'manage', icon:"fa fa-money", name: "Money", title: 'Team', header:'Team' }//code: "ACCESS_USR_LOGIN"
                    },
                    {
                        path: 'others',
                        loadChildren: () => import('app-modules/app-admin/team-setup/team/index').then(m => m.TeamManageModule),
                        data: { key:'manage', icon:"fa fa-money", name: "Money", title: 'Team', header:'Team' }//code: "ACCESS_USR_LOGIN"
                    }
                ]
            }
        ])
    ],
    declarations: [Layout]
})

export class TeamSetupModule{}


