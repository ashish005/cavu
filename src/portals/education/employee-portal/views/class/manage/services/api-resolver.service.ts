import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {EventEmitter, Injectable, Injector} from "@angular/core";
import { OrgResourceService, ASIDE_CLASS, ASIDE_SIZE, SharedService } from "@app-global";
import {LookupClassMasterType, LookupClassMasterTypeSerializer} from "../domains/lookup";
import {OrgClassCreateEditComponent, StudyModeListComponent} from "../components";

@Injectable()
export class OrgClassModuleAPIResolver extends OrgResourceService<LookupClassMasterType> implements Resolve<any> {
  masterType: LookupClassMasterType;
    constructor(public override injector: Injector, private popupService: SharedService) {
        super(injector, 'lookup/class', new LookupClassMasterTypeSerializer());
    }

  resolve(route: ActivatedRouteSnapshot) {
    const success = (results) => {
      this.masterType = results['data'];
    };

    const failure = (err: any) => {};
    const setup = this.read(this.apiVersion);
    return this.performRouteResolver(route.data, setup, success, failure);
  }

    showAllModes(inputData: any, headerOptions: any){
        const popup = {
            header: headerOptions,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_25
        };

        const success = (resp: any)=> {
            this.popupService.destroy();
        };
        const failure = ()=>{
            this.popupService.destroy();
        };

        let modal$ = this.popupService.showCustomPopup(StudyModeListComponent, popup, inputData);
        modal$.then(success, failure);
    }

    addUpdateClassPopup(inputData: any, headerOptions: any, cb){
        const popup = {
            header: headerOptions,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const success = (resp: any)=>{
            this.popupService.destroy();
            cb();
        };
        const failure = ()=>{
            this.popupService.destroy();
        };

        let modal$ = this.popupService.showCustomPopup(OrgClassCreateEditComponent, popup, inputData);
        modal$.then(success, failure);
    }
}
