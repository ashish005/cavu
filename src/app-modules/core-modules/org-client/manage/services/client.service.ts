import {Injectable, Injector} from '@angular/core';
import {OrgResourceService} from "@app-global";
import {Client, ClientSerializer} from "../domains/client.serializer";

@Injectable()
export class ClientService extends OrgResourceService<Client>{
  constructor(public override injector: Injector) { super(injector, 'customer', new ClientSerializer()); }
}
