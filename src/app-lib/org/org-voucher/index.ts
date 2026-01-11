import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Component, Injectable, Injector, Input, NgModule, OnInit, ViewChild} from "@angular/core";
import {FINANCE_COMPONENT, FINANCE_ENTRY_COMPONENT} from "./components";
import {FINANCE_SERVICES} from "./services";
import {FINANCE_POPOVER_COMPONENT} from "./popovers";
import {VoucherLayout} from "./views/voucher.layout";
import {VoucherPrintView} from "./views/voucher-print.view";
import {VoucherPopupLayout} from "./views/voucher-popup.layout";
import {GlobalModule} from "@app-global";

/*@Injectable()
export class CoreVoucherFactory {
    sharedService: SharedService;
    constructor(public injector: Injector) {
        this.sharedService = injector.get(SharedService);
    }

    showVoucherPopup(data: any, popupHeaderOptions: any, cb)
    {
        const popupOptions = {
            header: popupHeaderOptions,
            aside: ASIDE_CLASS.RIGHT, size: ASIDE_SIZE.W_75
            //aside: ASIDE_CLASS.BOTTOM, size: ASIDE_SIZE.H_85
        };

        data = data || {
            data: {
                id: null,
                voucherMasterType: null
            }
        };

        const success = (resp: any) => { this.destroy(); cb(); };
        const failure = (e) => { this.destroy(); };
        this.sharedService.showCustomPopup(VoucherPopupLayout, popupOptions, data).then(success, failure);
    }

    destroy = () => this.sharedService.destroy();
}*/

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule, GlobalModule
    ],
    declarations: [
        VoucherLayout, VoucherPopupLayout, VoucherPrintView,
        FINANCE_COMPONENT, FINANCE_ENTRY_COMPONENT, FINANCE_POPOVER_COMPONENT
    ],
    providers: [FINANCE_SERVICES],
    exports: [VoucherLayout]
})
export class CoreVoucherCEModule{}