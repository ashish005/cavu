import {Injectable, Injector} from "@angular/core";
import {Contact, ContactSerializer} from "../domains/contact.serializer";
import {map, tap} from "rxjs/operators";
import  { OrgResourceService } from "@app-global";

@Injectable()
export class ContactService extends OrgResourceService<Contact>{
    constructor(public override injector: Injector) { super(injector, `contact`, new ContactSerializer()); }

    grantAccessByUserId(data)
    {
        const url: string = `${this.baseAPIUrl}UserPermission/grant-access`;
        return this.httpClient.post(url, data, this.requestHeaders)
            .pipe(
                map(resp => resp),
                tap(
                    (error)=>{ this.handleError(error, () => this.grantAccessByUserId(data)) }
                )
            );
    }

    updateUserOrgId(userId: string, data: any)
    {
        const url: string = `${this.baseSectorAPIUrl}user/${userId}/grant-access`;
        return this.httpClient.put(url, data, this.requestHeaders)
            .pipe(
                map(resp => resp),
                tap(
                    (error)=>{ this.handleError(error, () => this.updateUserOrgId(userId, data)) }
                )
            );
    }
}
