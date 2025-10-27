import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {share} from "rxjs";
import {CommonModule} from "@angular/common";

class NavListData {
  activeFragment: any;
  constructor(public route: ActivatedRoute){
    this.activeFragment = this.route.fragment.pipe(share());
  }
}

@Component({
  selector: 'nav-list',
  templateUrl: './templates/nav-list.html', standalone: true, imports: [CommonModule, RouterModule]
})
export class NavListComponent extends NavListData {
  @Input() data: Array<any>;
  constructor(override route: ActivatedRoute){ super(route); }
}

@Component({
  selector: 'nav-list-tab',
  templateUrl: './templates/nav-list-tab.html', standalone: true, imports: [CommonModule, RouterModule]
})
export class NavListTabComponent extends NavListData {
  @Input() data: Array<any>;
  constructor(override route: ActivatedRoute){ super(route); }
}


@Component({
  selector: 'nav-list-master',
  templateUrl: './templates/nav-list-master.html', standalone: true, imports: [CommonModule, RouterModule]
})
export class NavListMasterComponent extends NavListData {
  @Input() data: Array<any>;
  @Output() cb: EventEmitter<any> = new EventEmitter<any>();

  constructor(override route: ActivatedRoute){ super(route); }

  activeNav: any;
  showRoutes(nav){
    this.activeNav = nav;
    this.cb.emit(nav);
  }
}
