import {Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, Router} from "@angular/router";
import  { OrgResourceService, ASIDE_CLASS, ASIDE_SIZE, SharedService } from "@app-global";
import {ProductLookup, ProductLookupSerializer} from "../domains/product.lookup";

@Injectable()
export class ProductLookupResolver extends OrgResourceService<ProductLookup> implements Resolve<any> {
    masterType: ProductLookup;
    constructor(public override injector: Injector, public sharedService: SharedService) {
        super(injector, 'productLookup', new ProductLookupSerializer());
    }

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => {
            this.masterType = results.data;
        };
        const failure = (err: any) => {};
        const setup = this.read(this.apiVersion);
        return this.performRouteResolver(route.data, setup, success, failure);
    }
}
