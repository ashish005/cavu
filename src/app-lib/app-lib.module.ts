import {NgModule} from "@angular/core";
import {CommonModule, CurrencyPipe, DatePipe} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FeedbackSupportModule, GlobalFilterModule} from "./global";

@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, FeedbackSupportModule, GlobalFilterModule
    ],
    exports: [ ]
})
export class AppLibModule {}
