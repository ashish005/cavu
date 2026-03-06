import {
    Component, Directive, ElementRef,
    EventEmitter, Injector,
    Input,
    OnInit,
    Output, TemplateRef, ViewChild
} from '@angular/core';
import {DocumentLookup, UserDocument, UserDocumentQueryOptions} from "./domains/user-document.serializer";
import {FileUploaderService} from "./services/file-uploader.services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpEventType, HttpRequest} from "@angular/common/http";
import {Uploader, UploadQueue} from "./domains/uploader";
import {pairwise, startWith} from "rxjs";
import {CoreEndpointBase} from "../../services";

@Directive()
class SameScreenFileUploaderComponent extends CoreEndpointBase {
    @ViewChild('file', {static: true}) fileControl: ElementRef;
    @ViewChild('image', { static: true }) imageEl: ElementRef;
    uploader: Uploader = new Uploader();
    uploadItem: UploadQueue;
    @Input() userId: string; // user  id is important
    @Input() lookups: DocumentLookup;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    uploadCustomForm: FormGroup;
    onSelectChange(event: any) {
        let eventObj: any = <any>event;
        let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
        let files: FileList = target.files;

        if(files && files.length>0) {
            for(let i=0; i<files.length; i++){
                let file = files[i];
                this.uploader.queue.push(new UploadQueue(file));
            }
        }
        //this.cb.emit(this.uploader);
    }

    onFilesChange(fileList: Array<File> | any) {
        for (let file of fileList) {
            this.uploader.queue.push(new UploadQueue(file));
        };
    }

    showUploader(){
        this.fileControl.nativeElement.click();
    }

    onFileInvalids(fileList: Array<File> | any) {
        //TODO handle invalid files here
    }

    updateActiveImg(uploader: UploadQueue) {
        this.uploadItem = uploader;
        this.updateActiveDocument(uploader);
    }

    constructor(public fb: FormBuilder, public override injector: Injector) {
        super(injector);
        this.uploadCustomForm = this.fb.group({
            categoryId: [null, Validators.required],
            docTypeId: [null, Validators.required],
            imageTypeId: ['1']
        });

        const formItemChange=([prev, next]: [any, any])=> {
            if(prev != next)
            {
                const docType = (this.lookups.docTypes || []).find(r => r.id == next);
                this.uploadCustomForm.get('categoryId').setValue(docType?.categoryId);
            }
        };
        this.uploadCustomForm.get('docTypeId').valueChanges.pipe(startWith(null as string), pairwise()).subscribe(formItemChange);
    }

    get formDocTypeId(){ return this.uploadCustomForm.get('docTypeId'); }
    get formImageTypeId() { return this.uploadCustomForm.get('imageTypeId'); }

    //getter : get overall progress
    get progress(): number {
        let psum = 0;
        if(!this.uploader){
            return 0;
        }
        for (let entry of this.uploader.queue) {
            psum += entry.progress;
        }

        if (psum == 0)
            return 0;

        return Math.round(psum / this.uploader.queue.length);
    };
    submitted: boolean;

    updateActiveDocument(queueItem){
        if (queueItem && queueItem.file) {
            this.uploadCustomForm.reset();
            this.uploadItem = queueItem;
            var reader = new FileReader();
            reader.onload = (e) => {
                this.imageEl.nativeElement.setAttribute('src', (e.target as FileReader).result);
            };
            reader.readAsDataURL(queueItem.file);
        }
    }

    uploadFileSubscriber = (request: HttpRequest<any>) => {
        this.httpClient.request(request).subscribe(event => {
            if (event.type === HttpEventType.UploadProgress)
                this.uploadItem.progress = Math.round(100 * event.loaded / event.total);
            else if (event.type === HttpEventType.Response) {
                this.uploadItem.message = event.body.toString();
            }
        });
    }

    uploadDocument(formData){
        if(this.uploadCustomForm.valid) {
            const info = formData.getRawValue();
            const urlParam = `document/uploadFiles/${this.userId}/${info.categoryId}/${info.docTypeId}/${info.imageTypeId}`;
            this.uploadFile(this.uploadItem, urlParam);
        }
    }

    uploadFile = (selectedFile, urlParam) => {
        const file = <File>selectedFile.file;

        if(!file){
            return;
        }
        const formData = new FormData();
        formData.append('files', file);

        const url = this.baseSectorAPIUrl+urlParam;
        this.submitted = true;
        const request = new HttpRequest('POST', url, formData, this.getMultipartFileUploadRequestHeaders);
        this.httpClient.request(request).subscribe(event => {
            if (event.type === HttpEventType.UploadProgress)
                selectedFile.progress = Math.round(100 * event.loaded / event.total);
            else if (event.type === HttpEventType.Response) {
                selectedFile.message = event.body.toString();
                this.removeUploadedFile(selectedFile);
                this.submitted = false;
            }
        });
    }

    removeUploadedFile(selectedFile){
        const _index = this.uploader.queue.findIndex((r)=> r.id === selectedFile.id);
        this.uploader.queue.splice(_index,1);
        if(this.uploader.queue.length==0){
            this.onOk.emit(true);
            return;
        }
        this.updateActiveDocument(this.uploader.queue[0]);
    }
}

@Component({
    standalone: false,
  selector: 'same-screen-file-upload-manager',
  templateUrl: './templates/same-screen-upload-manager.html',
  styleUrls: ['./file-upload-manager.scss']
})
export class SameScreenUploadManagerView extends SameScreenFileUploaderComponent implements OnInit {
  public message: string;
  @Input() userMasterType: string;
  //@Input() userId: string;
  @Output() cb: EventEmitter<any> = new EventEmitter<any>();
  coreState: UserDocumentQueryOptions = new UserDocumentQueryOptions();

  documents: Array<UserDocument>;
  //lookups: DocumentLookup;

  get showUploadScreen() { return this.uploader?.queue.length; };
  constructor(public service: FileUploaderService, public override fb: FormBuilder, public override injector: Injector){ super(fb, injector); }

  ngOnInit(){
      (<UserDocumentQueryOptions>this.coreState).userMasterType = this.userMasterType;
      (<UserDocumentQueryOptions>this.coreState).userId = this.userId;
      this.populateGrid();
  }

  populateGrid(){
      const success=(resp)=>{
          this.lookups = resp.lookups;
          this.documents =  resp.entities;
      };
      this.service.list(this.coreState).toPromise().then(success);
  }

    refreshDocuments(e){
        this.cb.emit(true);
    }
}
