import  { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import {UserType, UserTypeSerializer} from "../domains/user-type.serializer";

@Injectable()
export class UserTypeService extends OrgResourceService<UserType>{
    constructor(public override injector: Injector) { super(injector, 'access-setup/userType', new UserTypeSerializer());}
}
