import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'drop-down',
  templateUrl: './drop-down.html',
  standalone: true, imports: [ CommonModule ]
})
export class DropDownComponent implements OnInit {
  @Input() options: {
    title: string,
    label: string, //'name',
    key: string, //'id',
    listKey: string;
  };

  @Input() list: Array<any>;
  @Output() cb: EventEmitter<any> = new EventEmitter<any>();

  @Input() data: any;
  @Input() id: any;

  activeItem: any;
  constructor() {}

  changeItem(row: any){
    this.activeItem = row;
    this.data[this.options.key] = row[this.options.listKey];
    //this.cb.emit(row);
  }

  ngOnInit(){
    if(this.data){
      this.activeItem = this.list?.find(r => r[this.options.listKey] == this.id) || null;
    }
  }
}
