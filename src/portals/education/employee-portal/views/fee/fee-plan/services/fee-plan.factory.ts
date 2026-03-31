import {Injectable, Injector} from "@angular/core";
import {FeeMasterLayout} from "../summary/fee-master.layout";
import {FeePlanCeComponent} from "../components/fee-plan-ce.component";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService} from "@app-global";
import {FeeTypeCeFormComponent} from "../components/fee-type-ce-form.component";
import {FeeConcessionCeComponent} from "../components/fee-concession-ce.component";
import {FeePenaltyTypeCeFormComponent} from "../components/fee-penalty-type-ce-form.component";

@Injectable({providedIn: 'root'})
export class FeePlanPluginFactory {
    constructor(public sharedService: SharedService) {}

    showFeeTypesMasterPopup(cb)
    {
        const inputData: any = { viewType: 'feeType' };
        this.showFeePopup(inputData, { text: `Fee Type`, desc: 'Fee Type' }, cb);
    }
    showConcessionFeeMasterPopup(cb)
    {
        const inputData: any = { viewType: 'feeConcession' };
        this.showFeePopup(inputData, { text: `Fee Concession`, desc: 'Fee Concession' }, cb);
    }

    showFeePenaltyMasterPopup(cb)
    {
        const inputData: any = { viewType: 'feePenalty' };
        this.showFeePopup(inputData, { text: `Fee Penalty`, desc: 'Fee Penalty' }, cb);
    }

    private showFeePopup(data: any, header: any, cb)
    {
        const success = (resp: any) => { this.sharedService.destroy(); cb(); };
        const failure = (e) => { this.sharedService.destroy(); };
        const popupOptions = {
            header: header,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };
        //data = data;// || { viewType: 'feePenalty' || 'feeType' || 'feeType' };
        return this.sharedService.showCustomPopup(FeeMasterLayout, popupOptions, data).then(success, failure);
    }
    //fee plan summary
    feePlanCEPopup(data: any, header: any)
    {
        const popupOptions = {
            header: header || { text: `Fee Plan`, desc: `Fee Plan` },
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };
        data = data;
        return this.sharedService.showCustomPopup(FeePlanCeComponent, popupOptions, data);
    }

    ceFeeTypePopup(inputData, headerOptions)
    {
        const popupOptions = {
            header: headerOptions,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };
        return this.sharedService.showCustomPopup(FeeTypeCeFormComponent, popupOptions, inputData);
    }

    ceConcessionFeePopup(inputData, headerOptions)
    {
        const popupOptions = {
            header: headerOptions,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };
        return this.sharedService.showCustomPopup(FeeConcessionCeComponent, popupOptions, inputData);
    }

    ceFeePenaltyPopup(inputData, headerOptions)
    {
        const popupOptions = {
            header: headerOptions,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };
        return this.sharedService.showCustomPopup(FeePenaltyTypeCeFormComponent, popupOptions, inputData);
    }
    destroy(){ this.sharedService.destroy(); }
}