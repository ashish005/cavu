import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'avator-pic',
  templateUrl: './avator-pic.html',
  styleUrls: ['./avator-pic.scss'],
  standalone: true, imports: [ CommonModule ]
})
export class AvatorPicComponent implements OnInit{
  @ViewChild('filecontrol', { static: true })
  private fileControl : ElementRef;

  @ViewChild('imagePreview', { static: true })
  private imagePreviewEl: ElementRef;

  @Input() set docUrl(url: string){
    if(url){
      this.hasImage = true;
      this.imagePreviewEl.nativeElement.setAttribute('src', url);
    } else {
      this.hasImage = false;
    }
  }

  @Output() cb: EventEmitter<any> = new EventEmitter<any>();
  hasImage: boolean = false;

  constructor(public fb: FormBuilder){ }

  ngOnInit(){}

  onSelectChange(event: Event) {
    let eventObj: any = <any>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    const _file = files[0];

    this.hasImage = true;
    var reader = new FileReader();
    reader.onload = this.updateImage.bind(this);
    reader.readAsDataURL(files[0]);

    this.cb.emit(_file);
  }

  updateImage(e) {
    this.imagePreviewEl.nativeElement.setAttribute('src', e.target.result);
  }

  openFile(){
    this.fileControl.nativeElement.click();
  }
}

