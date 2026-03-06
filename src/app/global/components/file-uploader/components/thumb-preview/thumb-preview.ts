import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {UploadQueue} from "../../domains/uploader";

@Component({
  standalone: false,
  selector: '[thumb-preview]',
  template: '<img #image src="" alt="your image" style="display: inline-block; height: 50px; width: 50px; " />'
})
export class ThumbPreview {
  item: UploadQueue;
  @ViewChild('image', { static: true }) imageEl: ElementRef;
  @Input() height?: number;

  @Input() set src(input){
    if (input && input.file) {
      this.item = input;
      var reader = new FileReader();
      reader.onload = (e) => {
        this.imageEl.nativeElement.setAttribute('src', (e.target as FileReader).result);
      };
      reader.readAsDataURL(input.file);
    }
  }
}
