import {Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve } from "@angular/router";
import  { OrgResourceService } from "@app-global";
import {InventoryLookup, InventoryLookupSerializer} from "../domains/inventory-lookup.serializer";

@Injectable()
export class InventoryAPIResolver extends OrgResourceService<InventoryLookup> implements Resolve<any> {
    masterType: InventoryLookup;
    constructor(public override injector: Injector) { super(injector, 'lookup/inventory', new InventoryLookupSerializer()); }

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => { this.masterType = results.data; };
        const failure = (err: any) => {};
        const setup = this.read(this.apiVersion);
        return this.performRouteResolver(route.data, setup, success, failure);
    }
}
