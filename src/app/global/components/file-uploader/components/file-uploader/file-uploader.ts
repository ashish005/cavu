import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {Uploader, UploadQueue} from "../../domains/uploader";

@Component({
  standalone: false,
  selector: 'file-uploader',
  templateUrl: './file-uploader.html'
})
export class FileUploaderComponent {
  @ViewChild('file', {static: true}) fileControl: ElementRef;
  uploader: Uploader = new Uploader();
  activeFile: UploadQueue;
  @Output() cb: EventEmitter<any> = new EventEmitter<any>();

  onSelectChange(event: EventTarget | any) {
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
        this.activeFile = uploader;
    }

    uploadAs(){
        this.cb.emit(this.uploader);
    }
}

/*
class FileUploaderComponent {
    @ViewChild('file', {static: true}) fileControl: ElementRef;
    uploader: Uploader = new Uploader();
    activeFile: UploadQueue;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

    showUploader(){
        this.fileControl.nativeElement.click();
    }

    onSelectChange(event: EventTarget) {
        let eventObj: any = event;
        let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
        let files: FileList = target.files;

        if(files && files.length>0) {
            for(let i=0; i<files.length; i++){
                let file = files[i];
                this.uploader.queue.push(new UploadQueue(file));
            }
        }
    }

    onFilesChange(fileList: Array<File>) {
        for (let file of fileList) {
            this.uploader.queue.push(new UploadQueue(file));
        };
    }

    onFileInvalids(fileList: Array<File>) {
        //TODO handle invalid files here
    }

    updateActiveImg(uploader: UploadQueue) {
        this.activeFile = uploader;
    }

    uploadAs(){
        this.onOk.emit({ uploader: this.uploader, activeFile: this.activeFile });
    }
}*/
