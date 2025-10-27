import {Routes} from "@angular/router";
import {ContactsLayout} from "./layout/layout";
import {ContactView} from "./views/contact.view";
import {ContactAPIResolver} from "./services/api.resolver";

export const ContactRoutes: Routes = [
  {
    path: '', component: ContactsLayout, resolve: { items: ContactAPIResolver }, data: { title: 'Contact Access'},
    children:[
      { path: '', pathMatch: 'full', redirectTo:'employee' },
      { path: 'employee', component: ContactView, data: {title: 'Contact'} },
      { path: ':contactType', component: ContactView, data: {title: 'Contact'} },
    ]
  }
];

export const CONTACT_VIEWS = [ ContactsLayout, ContactView ];
