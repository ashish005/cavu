import {GlobalModule} from "@app-global";
import {Component, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {NotificationWorkflowView} from "./views/workflow.view";
import {ManageNotificationView} from "./views/manage.view";
import {NOTIFICATION_COMPONENT} from "./components";
import {NotificationAPIResolver} from "./services/api.resolver";
import {NotificationByIdResolver, NotificationService} from "./services/notification.service";
import {NotificationTemplateService} from "./services/template.service";
import {Layout} from "./layout/layout";
import {TemplateCeView} from "./views/template-ce.view";
import {NotificationSettingCeView} from "./views/notification-setting-ce.view";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '', component: Layout, resolve: { items: NotificationAPIResolver },
                data: { title: 'modules.notification.title', desc:'modules.notification.desc'},
                children: [
                    { path: '', pathMatch: 'full', redirectTo:'manage' },
                    {
                        path: 'manage', //canLoad:[PortalAuthGuard],
                        component: ManageNotificationView,
                        data: { icon:"fa fa-envelope-open", code: "ACCESS_NOTIFY_MGT", title: 'Access Setup', header:'Access Setup', name: "Notification", key: 'layout.notification'}
                    },
                    {
                        path: 'workflow', //canLoad:[PortalAuthGuard],
                        component: NotificationWorkflowView,
                        data: { icon:"fa fa-envelope-open", code: "ACCESS_NOTIFY_MGT", title: 'Access Setup', header:'Access Setup', name: "Notification", key: 'layout.notification'}
                    },
                    {
                        path: ':notificationId', resolve: { notification: NotificationByIdResolver },
                        children: [
                            { path: '', pathMatch: 'full', redirectTo: "DASHBOARD" },
                            { path: "DASHBOARD", component: TemplateCeView },
                            { path: "SMS", component: TemplateCeView },
                            { path: "EMAIL", component: TemplateCeView },
                            { path: 'setting', component: NotificationSettingCeView }
                        ]
                    }
                ]
            }
        ]),
        GlobalModule
    ],
    providers: [NotificationAPIResolver, NotificationByIdResolver, NotificationService, NotificationTemplateService],
    declarations: [Layout, NotificationWorkflowView, ManageNotificationView, TemplateCeView, NotificationSettingCeView, NOTIFICATION_COMPONENT]
})
export class OrgNotificationModule{}
