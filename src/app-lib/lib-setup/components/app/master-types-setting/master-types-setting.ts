import {Component, ElementRef, EventEmitter, Inject, Input, Output, ViewChild} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'master-type-options',
  templateUrl: './master-types-setting.html',
  standalone: false,
  styles: [`.master-type-setting {
    z-index: 1000;
    position: fixed;
    top: 120px;
    right: -300px;
    width: 300px;
    transition: right .2s ease;
    border: 1px solid rgba(120,120,120,.1);
  }
  .master-type-setting.active {
    right: -2px;
    z-index: 1060;
  }
  .master-type-setting.toggle {
    display: none;
  }
  .master-type-setting.active>.toggle {
    display: block;
    position: absolute;
    left: -34px;
    top: -1px;
    padding: 7px 8px 7px 15px;
    z-index: 1045;
    border: 1px solid rgba(120,120,120,.1);
    border-right-width: 0;
    background-clip: padding-box;
    border-radius: 24px 0 0 24px;
    background: #fff;
  }
  
  `]
})
export class MasterTypesSettingComponent{
  @ViewChild('masterTypeSetting', { static: true }) masterTypeSetting: ElementRef;
  @Input() list: any;
  @Output() cb: EventEmitter<any> = new EventEmitter<any>();

  constructor(@Inject(DOCUMENT) private document: Document, private router: Router, public activatedRoute: ActivatedRoute) {}

  toggleArea() {
    const {  navList } = this.list || { navList: []};
    if(navList.length == 1 && navList[0]?.children?.length == 1){
      this.showRoutes(navList[0].children[0]);
    } else {
      this.masterTypeSetting.nativeElement.classList.toggle('active');
    }
  }

  showRoutes(nav){
    const navUrl = `master-type/`+ nav.routeTo.join('/').toString();
    this.router.navigate([navUrl], {relativeTo: this.activatedRoute.parent});
  }
}
