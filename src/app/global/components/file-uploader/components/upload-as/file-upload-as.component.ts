import {
    Component,
    ElementRef,
    EventEmitter,
    Injector,
    Input,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpRequest} from "@angular/common/http";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Uploader, UploadQueue} from "../../domains/uploader";
import {DocumentLookup} from "../../domains/user-document.serializer";
import {CoreEndpointBase} from "../../../../services";
import {pairwise, startWith} from "rxjs";

@Component({
    standalone: false,
  selector: 'file-upload-as',
  templateUrl: './file-upload-as.html',
  styles: [`:host{ display: contents; }`]
})
export class FileUploadAsComponent extends CoreEndpointBase implements OnInit {
  @ViewChild('popupDocument', {static: true}) popupDocument: ElementRef;
  @ViewChild('image', { static: true }) imageEl: ElementRef;
  @Input() userId: string; // user  id is important
  @Input() uploader: Uploader;
  @Input() height?: number;
  @Input() lookups: DocumentLookup;
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  uploadItem: UploadQueue;
  public message: string;
  uploadCustomForm: FormGroup;
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
  constructor(public fb: FormBuilder, public override injector: Injector) {
    super(injector);
    this.message = '';
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

  ngOnInit(){
      this.updateActiveDocument(this.uploader.queue[0]);
      this.formImageTypeId.setValue('1');
  }

    /*updateForm(doc, imageTypeId){
      const { categoryId, id} = doc;
      this.uploadCustomForm.patchValue({ categoryId,  docTypeId: id, imageTypeId});
    }*/

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

  /*// upload
  upload(activeFile: UploadQueue) {
    const _uploaderFile = activeFile || this.activeFile;
    if (_uploaderFile == null)
      return;

    let selectedFile = this.uploader.queue.find(s => s.id == _uploaderFile.id);
    if (selectedFile) {
      this.uploadFile(selectedFile);
    }
  }
  //upload all selected files to server
  uploadAll() {
    //find the remaning files to upload
    let remainingFiles = this.uploader.queue.filter(s => !s.isSuccess);
    for (let item of remainingFiles) {
      this.upload(item);
    }
  }
  // cancel all
  cancelAll() {
    //TODO
  }*/
    onSelectChange(e){}
}
