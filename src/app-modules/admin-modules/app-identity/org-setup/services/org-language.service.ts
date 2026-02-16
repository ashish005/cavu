import { OrgResourceService } from "@app-global";
import {Injectable, Injector} from "@angular/core";
import { tap, catchError } from "rxjs";
import {
    OrgLanguage,
    OrgLanguageSerializer
} from "../domains/org-language.serializer";

@Injectable()
export class OrgLanguageService extends OrgResourceService<OrgLanguage>{
    constructor(public override injector: Injector) { super(injector, 'orgLanguage', new OrgLanguageSerializer()); }

    /*updateDefaultOrgCurrency(orgCurrencyId, data)
    {
        return this.httpClient
            .patch(`${this.viewUrl}/${orgCurrencyId}/update/default`, data, this.requestHeaders)
            .pipe(
                tap(
                    (error)=>{ this.handleError(error, () => this.updateDefaultOrgCurrency(orgCurrencyId, data)) }
                )
            );
    }*/

    addOrgLanguage(globalLanguageId, data)
    {
        return this.httpClient
            .post(`${this.baseSectorAPIUrl}orgLanguage/${globalLanguageId}/add`, data, this.requestHeaders)
            .pipe(
                catchError(error => this.handleError(error, () => this.addOrgLanguage(globalLanguageId, data)))
            );
    }
}
/*@Injectable()
export class GlobalLanguageService extends CoreOrgResourceService<GlobalLanguage>{
    constructor(public injector: Injector) { super(injector, 'language', new GlobalLanguageSerializer());}
}*/

