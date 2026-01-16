import {Component, ElementRef, Input, ViewChild} from "@angular/core";
import {SupportUploadQueue} from "../domain/support-uploader";

@Component({
  selector: '[support-thumb-preview]',
  standalone: false,
  template: '<img #image src="" alt="your image" class="w-100 h-100"/>'
})
export class SupportThumbPreview {
  item: SupportUploadQueue;
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
