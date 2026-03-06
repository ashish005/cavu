import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from "@angular/core";


@Component({
  standalone: false,
  selector: 'folding-nav',
  templateUrl: './folding-nav.html'
})
export class FoldingNav {
  @Input() data: Array<any>;
  @Output() cb: EventEmitter<any> = new EventEmitter<any>();

  upload(docType){
    this.cb.emit(docType);
  }
}
