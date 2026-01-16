import {NgModule} from "@angular/core";
import {CommonModule, CurrencyPipe, DatePipe} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {OrgCoreSetupModule} from "./org-seeder";
import {FeedbackSupportModule} from "./global";

@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        OrgCoreSetupModule, FeedbackSupportModule
    ],
    exports: [ ]
})
export class AppLibModule {}
