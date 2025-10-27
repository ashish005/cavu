import {NgModule} from "@angular/core";
import {CommonModule, CurrencyPipe, DatePipe} from "@angular/common";

import {GlobalModule} from "@app-global";

import {SHARED_COMPONENTS} from "./components/index";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NG_SELECT_COMPONENTS} from "./components/ng-select/index";

@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        GlobalModule, NG_SELECT_COMPONENTS
    ],
    declarations: [ SHARED_COMPONENTS ],
    //exports: [ SHARED_COMPONENTS, CORE_SETUP_PIPES ]
})
export class CoreSetupModule {}
