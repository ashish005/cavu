import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {CommunicationGateway, CommunicationGatewaySerializer} from "../domains/communication-gateway.serializer";

@Injectable()
export class CommunicationGatewayService extends OrgResourceService<CommunicationGateway>{
  constructor(public override injector: Injector) { super(injector, 'masterType/communicationGateway', new CommunicationGatewaySerializer());}
}
