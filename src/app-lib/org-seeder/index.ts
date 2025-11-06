import {Injectable, Injector, NgModule} from "@angular/core";
import {OrgSetupAPIResolver} from "./services/api.resolver";
import {OrgLayout} from "./layout/layout";
import {SharedService, ASIDE_CLASS, ASIDE_SIZE, GlobalModule} from "../../app/global";
import {OrgConfigView} from "./components/org-config.view";
import {SyncMasterComponent} from "./components/sync-master.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Injectable()
export class CoreSetupFactory {
    sharedService: SharedService;
    resolver: OrgSetupAPIResolver;
    constructor(public injector: Injector) {
        this.sharedService = injector.get(SharedService);
        this.resolver = injector.get(OrgSetupAPIResolver);
    }
    showPreSetupPopup() {
        const popupOptions = {
            header: { text: `Help us to setup your account`, desc: '' },
            aside: ASIDE_CLASS.CENTER,
            size: ASIDE_SIZE.W_75,
            //backdropDisabled: true
        };
        return this.resolver.resolve().then(()=> this.sharedService.showCustomPopup(OrgLayout, popupOptions, {}));
    }
    destroy = () => this.sharedService.destroy();
}
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule, GlobalModule
    ],
    providers: [OrgSetupAPIResolver, CoreSetupFactory],
    declarations: [OrgLayout, OrgConfigView, SyncMasterComponent],
    exports: []
})
export class OrgCoreSetupModule{}