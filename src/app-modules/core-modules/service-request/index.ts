import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import { ServiceRequestAPIResolver} from "./services/api.resolver";
import {Sr_Routes, SR_VIEWS} from "./service-request.routing";
import {SupportTicketService} from "./services/support-ticket.service";
import {SR_COMPONENTS, SR_ENTRY_COMPONENTS} from "./components";
import {GlobalModule} from "@app-global";
import {TicketConversationService} from "./services/conversation-ticket.service";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(Sr_Routes),
        GlobalModule
    ],
    providers: [ServiceRequestAPIResolver, SupportTicketService, TicketConversationService],
    declarations: [SR_VIEWS, SR_COMPONENTS]
})

export class ServiceRequestModule{}
