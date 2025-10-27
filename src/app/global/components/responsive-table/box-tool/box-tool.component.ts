import {Component, EventEmitter, Input, Output} from "@angular/core";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'box-tool',
  templateUrl: './box-tool.html', standalone: true, imports: [ CommonModule ]
})
export class BoxToolComponent {
  @Input() options: { add: boolean, refresh: boolean, sort: boolean };
  @Output() cb: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  onSubmit() {
    this.cb.emit(null);
  }

  addRecord() {
    this.cb.emit("Add");
  }

  refresh() {
    this.cb.emit("refresh");
  }
}
