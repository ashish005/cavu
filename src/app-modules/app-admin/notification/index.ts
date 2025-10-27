import {CoreModule, PortalAuthGuard} from "@app-global";
import {Component, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {Router, RouterModule, Routes} from "@angular/router";

@Component({templateUrl: './layout.html'})
export class Layout {
    public navList: Array<any> = [
        {
            isFLatChildren: true, key: 'mainLayout.heading.main',
            children:[
                //{ routeTo: ['dashboard'], icon:"fa fa-dashboard", key: 'mainLayout.dashboard' },
                { routeTo: ['one'], icon:"fa fa-envelope", key: 'one' },
                { routeTo: ['one/workflow'], icon:"fa fa-envelope", key: 'workflow' },
                { routeTo: ['flat'], icon:"fa fa-envelope", key: 'flat' },
                { routeTo: ['two'], icon:"fa fa-dashboard", key: 'two' }
            ]
        }
    ];
    constructor(){}
    onActivate(componentRef){}
}

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '', component: Layout,
                data: { title: 'modules.notification.title', desc:'modules.notification.desc'},
                children: [
                    { path: '', pathMatch: 'full', redirectTo:'one' },
                    {
                        path: 'flat', canLoad:[PortalAuthGuard],
                        loadChildren: () => import('app-common/notification/org-notification').then(m => m.NotificationPermissionModule),
                        data: { icon:"fa fa-envelope-open", code: "ACCESS_NOTIFY_MGT", title: 'Access Setup', header:'Access Setup', name: "Notification", key: 'layout.notification'}
                    },
                    {
                        path: 'two', canLoad:[PortalAuthGuard],
                        loadChildren: () => import('app-common/notification/org-notification1').then(m => m.NotificationPermissionModule),
                        data: { icon:"fa fa-envelope-open", code: "ACCESS_NOTIFY_MGT", title: 'Access Setup', header:'Access Setup', name: "Notification", key: 'layout.notification'}
                    },
                    {
                        path: 'one', canLoad:[PortalAuthGuard],
                        loadChildren: () => import('app-common/notification/org-new-notification').then(m => m.OrgNotificationModule),
                        data: { icon:"fa fa-envelope-open", code: "ACCESS_NOTIFY_MGT", title: 'Access Setup', header:'Access Setup', name: "Notification", key: 'layout.notification'}
                    },
                ]
            }
        ]),
        CoreModule.forChild()
    ],
    declarations: [Layout]
})
export class NotificationModule{}
