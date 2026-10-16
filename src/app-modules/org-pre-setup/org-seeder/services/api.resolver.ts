import {Injectable, Injector} from "@angular/core";
import {catchError, of} from "rxjs";
import {ConfigLookup, ConfigLookupSerializer} from "../domains/lookup.serializer";
import {OrgResourceService} from "@app-global";

@Injectable()
export class OrgSetupAPIResolver extends OrgResourceService<ConfigLookup> {
    masterType: ConfigLookup = new ConfigLookup();
    loadError: string | null = null;

    constructor(public override injector: Injector) { super(injector, 'v1/orgLookup/org-setup', new ConfigLookupSerializer()); }

    resolve() {
        this.loadError = null;
        const success = (results) => {
            this.masterType = results?.data ?? new ConfigLookup();
        };
        const failure = (err: any) => {};
        // Never block the wizard route on a lookup failure: the config step shows the error and a retry.
        const setup = this.read(this.orgSetup?.countryCode).pipe(
            catchError(err => {
                this.loadError = err?.message || 'Could not load configuration lookups.';
                return of({data: new ConfigLookup()});
            })
        );
        return this.performRouteResolver(this.apiVersion, setup, success, failure);
    }
}
