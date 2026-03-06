import {CommonModule} from "@angular/common";
import {Injectable, Injector, Input, ModuleWithProviders, NgModule} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";

import {FEE_PAYMENT_SERVICE} from "./services";
import {FEE_PAYMENT_COMPONENT} from "./components";

import {
    FeeMonthWiseSummaryComponent,
    FeePeriodWiseSummaryComponent
} from "./components/fee-period-wise-summary.component";
import {FeePaymentLayout} from "./layout/layout";
import {ACTION_ENUM, ASIDE_CLASS, ASIDE_SIZE, GlobalModule, SharedService} from "@app-global";

@Injectable({providedIn: 'root'})
export class FeePaymentPluginFactory
{
    sharedService: SharedService;
    constructor(public injector: Injector) {
        this.sharedService = injector.get(SharedService);
    }

    showStudentFeePaymentPopup(data: any, header: any)
    {
        const popupOptions = {
            header: header || { text: `Fee Type`, desc: `Fee Type` },
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_100
        };
        data = data || { actionType: ACTION_ENUM.SHOW };
        return this.sharedService.showCustomPopup(FeePaymentLayout, popupOptions, data);
    }

    showInvoiceWiseFeeSummaryPopup(data: any, header: any)
    {
        const popupOptions = {
            header: header || { text: `Fee Summary`, desc: `Fee Summary` },
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };
        data = data || {
            studentId: null,
            classId: null,
            orgSessionId: null,
        };
        return this.sharedService.showCustomPopup(FeePeriodWiseSummaryComponent, popupOptions, data);
    }

    showMonthWiseFeeSummaryPopup(data: any, header: any)
    {
        const popupOptions = {
            header: header || { text: `Fee Summary`, desc: `Fee Summary` },
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };
        data = data || {
            studentId: null,
            classId: null,
            orgSessionId: null,
        };
        return this.sharedService.showCustomPopup(FeeMonthWiseSummaryComponent, popupOptions, data);
    }
    destroy(){ this.sharedService.destroy(); }
}

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule, GlobalModule
    ],
    declarations: [FeePaymentLayout, FEE_PAYMENT_COMPONENT],
    providers: [FeePaymentPluginFactory, FEE_PAYMENT_SERVICE]
})
export class FeePaymentPluginModule {
    static forRoot(): ModuleWithProviders<FeePaymentPluginModule> { return { ngModule: FeePaymentPluginModule }; }
    static forChild(): ModuleWithProviders<FeePaymentPluginModule> { return { ngModule: FeePaymentPluginModule }; }
}