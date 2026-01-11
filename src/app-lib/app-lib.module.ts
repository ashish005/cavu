import {NgModule} from "@angular/core";
import {CommonModule, CurrencyPipe, DatePipe} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {OrgCoreSetupModule} from "./org-seeder";

@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        OrgCoreSetupModule
    ],
    exports: [ ]
})
export class AppLibModule {}
