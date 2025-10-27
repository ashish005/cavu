import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {Injectable, Injector} from "@angular/core";
import {LookupTaxCategory, LookupTaxCategorySerializer} from "../domains/lookup";
import  { ASIDE_CLASS, ASIDE_SIZE, SharedService, OrgResourceService } from "@app-global";
import {TaxCategoryCreateEditComponent} from "../components/tax-category-create-edit.component";
import {TaxRateListComponent} from "../views/tax-rate-list.view";

@Injectable()
export class TaxManagementModuleAPIResolver extends OrgResourceService<LookupTaxCategory> implements Resolve<any> {
  masterType: LookupTaxCategory;

  constructor(public override injector: Injector, private sharedService: SharedService) { super(injector, 'lookup/tax', new LookupTaxCategorySerializer()); }

  resolve(route: ActivatedRouteSnapshot) {
    const success = (results) => {
      this.masterType = results['data'];
    };

    const failure = (err: any) => {};

    const setup = super.read(super.apiVersion);

    return super.performRouteResolver(route.data, setup, success, failure);
  }

    showAllTaxRates(inputData: any, popupHeader: any){
        const popup = {
            header: popupHeader,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };

        const success = (resp: any)=>{
            this.sharedService.destroy();
        };
        const failure = ()=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(TaxRateListComponent, popup, inputData);
        modal$.then(success, failure);
    }

    addUpdateTaxCategoryPopup(inputData: any, popupHeader, cb){
        const popup = {
            header: popupHeader,
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

        let modal$ = this.sharedService.showCustomPopup(TaxCategoryCreateEditComponent, popup, inputData);
        modal$.then(success, failure);
    }
}
