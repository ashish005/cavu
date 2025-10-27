import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {Conversation, ConversationSerializer} from "../domains/conversation.serializer";

@Injectable()
export class ConversationService extends OrgResourceService<Conversation> {
    constructor(public override injector: Injector) {
        super(injector, 'conversation', new ConversationSerializer());
    }
}
