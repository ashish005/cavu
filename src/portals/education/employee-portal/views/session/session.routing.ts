import {Routes} from "@angular/router";
import {BatchView} from "./views/batch.view";
import {Layout} from "./layout/layout";
import {SessionAPIResolver} from "./services/api.resolver";
export const SessionSetupRoutes: Routes = [
    {
        path: '', component: Layout, resolve: { items: SessionAPIResolver },
        children:[
            { path: '', pathMatch: 'full', redirectTo:'batch' },
            { path: 'batch', component: BatchView, data: { title: 'Batch', header:'Batch'} },
            { path: ':sessionId', component: BatchView, data: { title: 'Session Batch', header:'Batch'} }
        ]
    }
];
export const SESSION_VIEWS = [ Layout, BatchView ];
