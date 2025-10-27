import {
  Component,
  ElementRef, EventEmitter, Input, OnInit, Output
} from "@angular/core";

@Component({
  standalone: true,
  selector: 'flat-slider-dropdown',
  templateUrl: './templates/flat-slider-dropdown.html'
})
export class FlatSliderDropdownComponent implements OnInit
{
  activeItem: any;
  @Output() cb?: EventEmitter<any> = new EventEmitter<any>();
  sliderOptions: any = { showClear: true };
  @Input() name: string;
  hasNoChild: boolean;
  private records: Array<any>;

  @Input() set data(rec: Array<any>){
    this.records = rec || [];
    this.hasNoChild = (this.records.length==1 && this.records[0].children.length<=1);
  };

  constructor( private el: ElementRef){}

  ngOnInit(){}

  selectedChildData(parent: any, child: any){
    this.name = `${parent.name} - ${child.name}`;
    this.cb.emit({ parent: parent, child: parent });
  }
}
