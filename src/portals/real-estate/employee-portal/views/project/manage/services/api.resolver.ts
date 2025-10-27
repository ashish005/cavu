import {Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from "@angular/router";
import {ProjectLookup, ProjectLookupSerializer} from "../domains/project.lookup";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService, OrgResourceService } from "@app-global";

@Injectable()
export class ProjectAPIResolver extends OrgResourceService<ProjectLookup> implements Resolve<any>
{
    masterType: ProjectLookup;
    constructor(public override injector: Injector, public route: Router,
                public sharedService: SharedService) {
        super(injector, 'projectLookup', new ProjectLookupSerializer());
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const success = (results) => { this.masterType = results.data; };
        const failure = (err: any) => {};
        //const endpoint = `${route.params.projectId}`;
        const setup = super.read(this.apiVersion);
        return this.performRouteResolver(route.data, setup, success, failure);
    }

    showPaymentPopup(inputData, popupHeader){
        //inputData.lookupMasterType = 'expense';
        /*const onSuccess = (resp)=> { this.pluginFactory.destroy(); };
        const onFailure = (resp)=> { this.pluginFactory.destroy(); };
        const modal$ = this.pluginFactory.showVoucherPurchasePaymentPopup(inputData, popupHeader);
        modal$.then(onSuccess, onFailure);*/
    }

    showReceiptPopup(inputData, popupHeader){
        //inputData.lookupMasterType = 'expense';
        /*const onSuccess = (resp)=> { this.pluginFactory.destroy(); };
        const onFailure = (resp)=> { this.pluginFactory.destroy(); };
        const modal$ = this.pluginFactory.showVoucherSaleReceiptPopup(inputData, popupHeader);
        modal$.then(onSuccess, onFailure);*/
    }

    showVoucherReportPopup(dataItem, popupHeaderOptions){
        //inputData.lookupMasterType = 'expense';
        /*const onSuccess = (resp)=> { this.pluginFactory.destroy(); };
        const onFailure = (resp)=> { this.pluginFactory.destroy(); };
        const modal$ = this.pluginFactory.showVoucherReportPopup(dataItem, popupHeaderOptions);
        modal$.then(onSuccess, onFailure);*/
    }

    showOrgWorkflowPopup(data, popupHeaderOptions){
        //inputData.lookupMasterType = 'expense';
        /*const onSuccess = (resp)=> { this.pluginFactory.destroy(); };
        const onFailure = (resp)=> { this.pluginFactory.destroy(); };
        const modal$ = this.pluginFactory.showOrgWorkflowPopup(data, popupHeaderOptions);
        modal$.then(onSuccess, onFailure);*/
    }

    showProjectWorkflowPopup(data, popupHeaderOptions){
        //inputData.lookupMasterType = 'expense';
        /*const onSuccess = (resp)=> { this.pluginFactory.destroy(); };
        const onFailure = (resp)=> { this.pluginFactory.destroy(); };
        const modal$ = this.pluginFactory.showProjectWorkflowPopup(data, popupHeaderOptions);
        modal$.then(onSuccess, onFailure);*/
    }

    showOrgStagesPopup(data, popupHeaderOptions){
        //inputData.lookupMasterType = 'expense';
        /*const onSuccess = (resp)=> { this.pluginFactory.destroy(); };
        const onFailure = (resp)=> { this.pluginFactory.destroy(); };
        const modal$ = this.pluginFactory.showOrgStagesPopup(data, popupHeaderOptions);
        modal$.then(onSuccess, onFailure);*/
    }

    showProjectTaskCEPopup(inputData, popupHeaderOption, cb){
        /*const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (err)=> { this.pluginFactory.destroy(); };
        this.pluginFactory.showOrgTaskCEPopup(inputData, popupHeaderOption).then(success, failure);*/
    }

    showProjectProessCEPopup(inputData, popupHeaderOption, cb){
        /*const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (err)=> { this.pluginFactory.destroy(); };
        this.pluginFactory.showOrgProessCEPopup(inputData, popupHeaderOption).then(success, failure);*/
    }
}
