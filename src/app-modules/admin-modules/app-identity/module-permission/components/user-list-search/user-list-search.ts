import {Component, EventEmitter, Output} from "@angular/core";

@Component({
    standalone: false,
  selector: 'user-list-search',
  templateUrl: './user-list-search.html'
})
export class UserListSearchComponent {
  @Output() cb: EventEmitter<any> = new EventEmitter<any>();

  feeFilter(data){
    this.cb.emit(data)
  }

  hostListenerClick(e) {
    e.stopPropagation();
  }
}
