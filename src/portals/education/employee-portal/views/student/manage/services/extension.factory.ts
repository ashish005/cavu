import {Injectable, Injector} from "@angular/core";
import {SharedService} from "@app-global";

@Injectable()
export class StudentExtensionFactory {
    constructor(public sharedService: SharedService
                //, private feePluginFactory: FeePluginFactory
    ) {}

    showUserNotificationTemplateViewPopup(inputData, popupHeader) {
        /*const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (e) => { this.pluginFactory.destroy(); };
        this.pluginFactory.showUserNotificationTemplateViewPopup(inputData, popupHeader).then(success, failure);*/
    }

    showLedgerWiseGridReportPopup(inputData: any, popupHeader) {
        /*const success = (resp: any) => { this.pluginFactory.destroy(); };
        const failure = (e) => { this.pluginFactory.destroy(); };
        this.pluginFactory.showLedgerWiseGridReportPopup(inputData, popupHeader).then(success, failure);*/
    }
}