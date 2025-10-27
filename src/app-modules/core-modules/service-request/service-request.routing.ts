import { Routes} from "@angular/router";
import {ServiceRequestLayoutComponent} from "./layout/layout";
import {TicketView} from "./views/ticket.view";
import {FaqView} from "./views/faq.view";
import {ServiceRequestAPIResolver} from "./services/api.resolver";
import {TicketDetailsView} from "./views/ticket-details.view";

export const Sr_Routes: Routes = [
  {
    path: '', component: ServiceRequestLayoutComponent, resolve: { items: ServiceRequestAPIResolver },
    children: [
      { path: '', pathMatch: 'full', redirectTo:'ticket' },
      { path: 'ticket', component: TicketView, data: { title: 'Ticket'} },
      { path: 'ticket/:id', component: TicketDetailsView, data: { title: 'Ticket'} }
    ]
  },
  { path: 'faq', component: FaqView, data: { title: 'Faq' }}
];

export const SR_VIEWS = [
  ServiceRequestLayoutComponent,
  TicketView,
  TicketDetailsView,
  FaqView
];
