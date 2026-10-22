import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {AsidePanelComponent, GlobalModule} from "@app-global";
import {OcrConfigApiService} from "./ocr-config-api.service";
import {OcrProvidersView} from "./ocr-providers.view";

/** Platform › OCR providers (`/app/admin/platform-ocr`): providers, models and keys per country. Root users only (the API refuses others). */
@NgModule({
    imports: [
        CommonModule, FormsModule, GlobalModule, AsidePanelComponent,
        RouterModule.forChild([{path: '', component: OcrProvidersView, data: {title: 'OCR providers', header: 'OCR providers'}}, {path: '**', redirectTo: ''}])
    ],
    providers: [OcrConfigApiService],
    declarations: [OcrProvidersView]
})
export class PlatformOcrModule {}
