import {Injectable, Injector} from '@angular/core';
import  { OrgResourceService } from "@app-global";
import {Executive, ExecutiveSerializer} from "../domains/executive.serializer";

@Injectable()
export class ExecutiveService extends OrgResourceService<Executive>{
    constructor(public override injector: Injector) {
        super(injector, 'vendorExecutive', new ExecutiveSerializer());
    }
}
