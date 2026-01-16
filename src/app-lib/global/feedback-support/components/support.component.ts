import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  Directive,
  TemplateRef
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {SupportUploader, SupportUploadQueue} from "../domain/support-uploader";
import {HttpEventType} from "@angular/common/http";
import {FeedbackSupportService} from "../services";

declare const html2canvas: any;

@Directive()
class SupportFileUploaderComponent {
  @ViewChild('fileControl', {static: true}) fileControl: ElementRef;
  public uploader: SupportUploader = new SupportUploader();
  public message: string;

  onFilesChange(fileList: any) {
    for (let file of fileList) {
      this.uploader.queue.push(new SupportUploadQueue(file));
    }
  }

  showUploader(){
    this.fileControl.nativeElement.click();
  }

  onFileInvalids(fileList: any) {
    //TODO handle invalid files here
  }

  onSelectChange(event: Event) {
    let eventObj: any = <any>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;

    if(files && files.length>0) {
      for(let i=0; i<files.length; i++){
        let file = files[i];
        this.uploader.queue.push(new SupportUploadQueue(file));
        console.log('Total Count:' + this.uploader.queue.length);
      }
    }
  }

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
}

@Component({
  selector: 'support', standalone: false,
  templateUrl:'./templates/support.html',
  styles: [`:host{ display: contents; }`], providers: [FeedbackSupportService]
})
export class SupportComponent extends SupportFileUploaderComponent implements OnInit {
  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  @ViewChild('webPageImagePreview', { static: true }) webPageImagePreview: ElementRef;
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  customForm: FormGroup;
  submitted: boolean = false;
  loadingText: string = 'Creating';
  supportTicketId: number;
  @Input() supportType: string;
  get actionType (){ return (this.supportTicketId) ? 'UPDATE': 'ADD'; };
  get isLoading() { return this.service.isLoading; };

  public captureScreen(){
    const modalBackdrop = document.querySelector('.modal-backdrop.show') as HTMLElement | null;
    if (modalBackdrop) {
      modalBackdrop.setAttribute('data-html2canvas-ignore', "true");
    }
    const modalAside = document.querySelector('.modal-open-aside.show') as HTMLElement | null;
    if (modalAside) {
      modalAside.setAttribute('data-html2canvas-ignore', "true");
    }
    if (typeof html2canvas !== 'function') {
      return Promise.resolve(null);
    }
    return html2canvas(document.body);
  }

  constructor(public fb: FormBuilder, public router: Router, public service: FeedbackSupportService){
    super();
    this.customForm = this.fb.group({
      /*userTypeId: [{value:null, disabled: true }],*/
      userId: [{value:null, disabled: true }],
      supportTypeId: [null, Validators.required],
      mediaTypeId: [null],
      header: [null, Validators.required],
      message: [null, Validators.required],
      /*mobileNo: [null],
      emailId: [null],*/
      file: [null],
      includeScreenshot: [true],
      ip: [{value:null, disabled: true }],
      pageURL: [{value:null }]
    });
  }

  captureImageAndShow = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) {
      return;
    }
    // Export the canvas to its data URI representation
    var base64image = canvas.toDataURL("image/png");
    this.webPageImagePreview.nativeElement.setAttribute('src', base64image);
    this.customForm.get('file').setValue(base64image);
  };

  get f() { return this.customForm.controls; }

  ngOnInit(){
    this.captureScreen().then(this.captureImageAndShow);
    this.service.getSupportLookup().then(r => {
      const mediaType: any = this.service.masterType?.getInboxMediaType();
      this.customForm.get('mediaTypeId').setValue(mediaType?.id);
      if(this.supportType)
      {
        const supportType = this.service.masterType?.getSupportTypeByMasterType(this.supportType);
        this.customForm.get('supportTypeId').setValue(supportType?.id);
      }

    });
    this.customForm.get('pageURL').setValue(window.location.href);
  }

  onSubmit(form){
    if(this.customForm.invalid){
      return;
    }

    this.submitted = true;

    const success = (resp)=> {
      this.submitted = true;
      this.supportTicketId = resp.id;
      this.onOk.emit(true);
      this.uploadAll();
    };

    const failure = ()=> {
      this.submitted = true;
    };

    const data = this.customForm.getRawValue();
    const supportTicket = this.service.saveSupportTicket(data).toPromise();
    supportTicket.then(success, failure);
  }

  upload(_uploaderFile: SupportUploadQueue) {
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

  uploadFile = (selectedFile) => {
    const file = <File>selectedFile.file;

    if(!(file && this.supportTicketId)){
      return;
    }

    this.service.supportTicketUploadImages(this.supportTicketId, file).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress)
        selectedFile.progress = Math.round(100 * event.loaded / event.total);
      else if (event.type === HttpEventType.Response) {
        selectedFile.message = event.body.toString();
      }
    });
  }
}