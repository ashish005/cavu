import {Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import  { OrgResourceService } from "@app-global";
import {DocumentLookup, DocumentLookupSerializer} from "../domains/lookup";

@Injectable()
export class DocumentAccessAPIResolver extends OrgResourceService<DocumentLookup> implements Resolve<any> {
    masterType: DocumentLookup;
    constructor(public override injector: Injector) { super(injector, 'access-setup/lookup/document', new DocumentLookupSerializer());}

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => { this.masterType = results['data']; };
        const failure = (err: any) => {};
        const setup = this.read(this.apiVersion);
        return this.performRouteResolver(route.data, setup, success, failure);
    }
}
