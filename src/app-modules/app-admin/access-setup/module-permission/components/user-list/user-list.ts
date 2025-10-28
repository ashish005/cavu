import {Component, EventEmitter, Output} from "@angular/core";

@Component({
    standalone: false,
  selector: 'user-list',
  templateUrl: './user-list.html'
})
export class UserListComponent {
  @Output() cb: EventEmitter<any> = new EventEmitter<any>();

  feeFilter(data){
    this.cb.emit(data)
  }

  hostListenerClick(e) {
    e.stopPropagation();
  }
}
