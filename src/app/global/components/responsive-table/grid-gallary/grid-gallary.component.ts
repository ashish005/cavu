import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'e-img',
  template: `<span>
    <img *ngIf="hasImgSrc" [src]="profileUrl" alt="Profile Pic" class="w-40"><i class="on avatar-bottom"></i>
    <span *ngIf="!hasImgSrc" class="w-40"><i class="fa fa-user"></i></span>
  </span>`, standalone: true, imports: [CommonModule]
})
export class ImgComponent implements OnInit {
  @Input() profileUrl: string;
  hasImgSrc: boolean;

  constructor(){}

  ngOnInit(){
    this.hasImgSrc = !!(this.profileUrl || '').toLowerCase().match(/.(jpg|jpeg|png|gif)$/i);
  }
}

@Component({
  selector: 'grid-gallary',
  templateUrl: './grid-gallary.html', standalone: true, imports: [CommonModule, ImgComponent]
})
export class GridGallaryComponent {
  @Input() data: Array<{id: string; address: string; bloodGroup: string; birthday: string; email: string; phone: string; name: string; profileId: string; profileUrl: string; userId: string; registrationNo: string;}>;
  @Input() options: any;

  @Output() cb: EventEmitter<any> = new EventEmitter(true);
  @Output() orderUpdateCb: EventEmitter<any> = new EventEmitter(true);


  editInfo(row: any){
    this.cb.emit(row);
  }
}
