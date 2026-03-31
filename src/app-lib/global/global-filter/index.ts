import {Injectable, Injector, NgModule} from "@angular/core";
import {ASIDE_CLASS, ASIDE_SIZE, GlobalModule, SharedService} from "@app-global";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GlobalFilterComponent} from "./global-filter.component";

@Injectable({ providedIn: 'root' })
export class GlobalFilterFactory {
    sharedService: SharedService;
    constructor(public injector: Injector) { this.sharedService = injector.get(SharedService); }

    showGlobalFilterPopup(){
        const popupOptions = {
            header: { text: `Report Issue`, desc: 'Automatically captures the page where you are facing issues' },
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_50
        };
        const inputData = {};
        const success = ()=> {
            this.sharedService.destroy();
        };
        const failure = ()=> { this.sharedService.destroy(); };
        this.sharedService.showCustomPopup(GlobalFilterComponent, popupOptions, inputData).then(success, failure);
    }
}

@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, GlobalModule
    ],
    providers: [GlobalFilterFactory],
    declarations: [GlobalFilterComponent],
    exports: []
})
export class GlobalFilterModule{}