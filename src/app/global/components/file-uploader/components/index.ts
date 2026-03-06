import {FileUploaderComponent} from "./file-uploader/file-uploader";
import {ThumbPreview} from "./thumb-preview/thumb-preview";
import {UploadPreview} from "./upload-preview/upload-preview";
import {FoldingNav} from "./folding-nav/folding-nav";
import {FileUploadAsComponent} from "./upload-as/file-upload-as.component";

export {FileUploadAsComponent} from "./upload-as/file-upload-as.component";

export const FILE_UPLOADER_COMPONENT = [UploadPreview, FileUploaderComponent, ThumbPreview, FoldingNav, FileUploadAsComponent];
