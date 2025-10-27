import {Injectable, Injector, OnDestroy} from "@angular/core";
import  { OrgResourceService, SharedService } from "@app-global"

import {
  GlobalSearchLookup,
  GlobalSearchLookupSerializer
} from "../domains/global-search-lookup";

@Injectable()
export class GlobalSearchLookupService extends OrgResourceService<GlobalSearchLookup> {
  data: GlobalSearchLookup;

    constructor(public override injector: Injector, private popupService: SharedService) {
        super(injector, `lookup/global-search`, new GlobalSearchLookupSerializer());
    }

    fetch(){
        this.read(this.apiVersion).subscribe(resp => {
            this.data = resp['data'];
        }, err=>  {

        });
    };

}
