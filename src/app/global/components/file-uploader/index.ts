import {CommonModule} from "@angular/common";
import {ModuleWithProviders, NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FILE_UPLOADER_COMPONENT} from "./components";
import {UploadManagerView} from "./upload-manager.view";
import {FileUploaderService} from "./services/file-uploader.services";
import {SameScreenUploadManagerView} from "./same-screen-upload-manager.view";

@NgModule({
    declarations: [UploadManagerView, SameScreenUploadManagerView, FILE_UPLOADER_COMPONENT],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [FileUploaderService],
    exports: [UploadManagerView, SameScreenUploadManagerView, FILE_UPLOADER_COMPONENT]
})

export class FileUploadManagerModule{
}
