import {Injectable, Injector} from "@angular/core";
import {ASIDE_CLASS, ASIDE_SIZE, SharedService} from "@app-global";
import {MasterTypeLayout} from "../components/master-type.component";

@Injectable()
export class ProductExtensionFactory {
    constructor(public sharedService: SharedService) {}

    showMasterTypePopup(inputData, popupHeader){
        const popup = {
            header: popupHeader,
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };

        const success = (resp: any)=>{
            this.sharedService.destroy();
        };
        const failure = ()=>{
            this.sharedService.destroy();
        };

        let modal$ = this.sharedService.showCustomPopup(MasterTypeLayout, popup, inputData);
        modal$.then(success, failure);
    }
}
