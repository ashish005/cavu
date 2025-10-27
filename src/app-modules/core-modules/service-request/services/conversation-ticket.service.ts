import {Injectable, Injector} from "@angular/core";
import  { OrgResourceService } from "@app-global"
import {Conversation, ConversationSerializer} from "../domains/conversation.serializer";

@Injectable()
export class TicketConversationService extends OrgResourceService<Conversation>{
   //getCurrentUser(){ return this.coreService.currentUser; }
   constructor(public override injector: Injector) { super(injector, 'ticketConversation', new ConversationSerializer()); }
}


