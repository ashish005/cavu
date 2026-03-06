import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {UploadQueue} from "../../domains/uploader";

@Component({
  standalone: false,
  selector: '[upload-preview]',
  templateUrl: './upload-preview.html'
})
export class UploadPreview {
  uploadItem: UploadQueue;
  @ViewChild('image', { static: true }) imageEl: ElementRef;
  @Input() height?: number;

  @Input() set src(input){
    if (input && input.file) {
      this.uploadItem = input;
      var reader = new FileReader();
      reader.onload = (e) => {
        this.imageEl.nativeElement.setAttribute('src', (e.target as FileReader).result);
      };
      reader.readAsDataURL(input.file);
    }
  }
}
