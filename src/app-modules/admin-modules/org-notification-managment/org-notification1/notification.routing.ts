import {Routes} from "@angular/router";
import {OrgNotificationAPIResolver, NotificationByIdResolver} from "./services/api.resolver";
import {Layout1} from "./layout/layout1";
import {TemplateCeView} from "./views/template-ce-view";
import {GridNotificationView} from "./views/grid-notification.view";
import {ListNotificationView} from "./views/list-notification.view";

const managePageData = {
  notification: { title: 'modules.notification.title', desc:'modules.notification.desc'}
};

export const NotificationRoutes: Routes = [
    {
        path: '', resolve: { items: OrgNotificationAPIResolver }, component: Layout1,
        data: managePageData.notification,
        children: [
            { path: '', pathMatch: 'full', redirectTo:'grid' },
            { path: 'grid', component: GridNotificationView },
            {
                path: 'list', component: ListNotificationView,
                children: [
                    {
                        path: ':id', resolve: { notification: NotificationByIdResolver },
                        children: [
                            { path: '', pathMatch: 'full', redirectTo: 'DASHBOARD' },
                            { path: 'DASHBOARD', component: TemplateCeView },
                            { path: 'SMS', component: TemplateCeView },
                            { path: 'EMAIL', component: TemplateCeView },
                            { path: 'setting', component: TemplateCeView }
                        ]
                    }
                ]
            },

        ]
    }
];

export const NOTIFICATION_VIEWS = [
    Layout1, TemplateCeView, GridNotificationView, ListNotificationView
];
