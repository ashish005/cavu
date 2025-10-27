import {GlobalModule} from "@app-global";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {COMMUNICATION_VIEWS, CommunicationRoutes} from "./communication.routing";
import {ConversationService} from "./services/conversation.service";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(CommunicationRoutes),
      GlobalModule
    ],
    declarations: [COMMUNICATION_VIEWS],
    providers: [ConversationService]
})

export class CommunicationModule{
}
