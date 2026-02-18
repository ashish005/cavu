import {Routes} from "@angular/router";
import {NotificationAPIResolver} from "./services/api.resolver";
import {
    ManageGridNotificationView,
    ManageNotificationView
} from "./views/manage-notification.view";
import {Layout} from "./layout/layout";

const managePageData = {
  notification: { title: 'modules.notification.title', desc:'modules.notification.desc'}
};

export const NotificationRoutes: Routes = [
  {
    path: '', resolve: { items: NotificationAPIResolver }, component: Layout,
    data: managePageData.notification,
    children: [
      { path: '', pathMatch: 'full', redirectTo:'list' },
      { path: 'board', component: ManageNotificationView },
      { path: 'list', component: ManageGridNotificationView }
    ]
  }
];

export const NOTIFICATION_VIEWS = [ Layout, ManageNotificationView, ManageGridNotificationView];
