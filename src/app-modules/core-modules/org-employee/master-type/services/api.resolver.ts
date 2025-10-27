import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {Injectable, Injector} from "@angular/core";
import  { ASIDE_CLASS, ASIDE_SIZE, SharedService, OrgResourceService } from "@app-global";
import {EmployeeMasterLookup, EmployeeMasterLookupSerializer} from "../domains/lookup";
import {DutyCeComponent, PostCeComponent} from "../components";

@Injectable()
export class EmployeeMasterTypeAPIResolver extends OrgResourceService<EmployeeMasterLookup> implements Resolve<any> {
  masterType: EmployeeMasterLookup;
    constructor(public override injector: Injector, private sharedService: SharedService) {
        super(injector, 'masterlookup/employee', new EmployeeMasterLookupSerializer());
    }

  resolve(route: ActivatedRouteSnapshot) {
    const success = (results) => {
      this.masterType = results['data'];
    };

    const failure = (err: any) => {};

    const setup = super.read(super.apiVersion);

    return super.performRouteResolver(route.data, setup, success, failure);
  }

  addUpdatePostPopup(inputData: any, cb){
        const popup = {
            header: inputData.header,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const success = (resp: any)=>{
            this.sharedService.destroy();
            cb();
        };
        const failure = ()=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(PostCeComponent, popup, inputData);
        modal$.then(success, failure);
    }
  addUpdateDutyConstraintPopup(inputData: any, cb){
        const popup = {
            header: inputData.header,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        inputData.data = {
            otherData: inputData.otherData,
            row: inputData.data
        };

        const success = (resp: any)=>{
            this.sharedService.destroy();
            cb();
        };
        const failure = (e)=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(DutyCeComponent, popup, inputData);
        modal$.then(success, failure);
    }
}
