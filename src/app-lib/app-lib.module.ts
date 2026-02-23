import {NgModule} from "@angular/core";
import {CommonModule, CurrencyPipe, DatePipe} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FeedbackSupportModule} from "./global";

@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, FeedbackSupportModule
    ],
    exports: [ ]
})
export class AppLibModule {}
