import {Routes} from "@angular/router";
import {ClientLayout} from "./layout/layout";
import { ClientAPIResolver} from "./services";
import {ClientManageView} from "./views/client-manage.view";

export const ClientProject_Routes: Routes = [
  {
    path: '', data: { isClient: true, code:'PERM_CLIENT', title: 'modules.client.title', header: 'modules.client.header' },
    resolve: { lookups: ClientAPIResolver },
    component: ClientLayout,
    children:[
        { path: '**', component: ClientManageView }
    ]
  }
];

export const CLIENT_VIEWS = [
    ClientLayout, ClientManageView
];
