import {
  Component,
  ElementRef, EventEmitter, Input, OnInit, Output
} from "@angular/core";

@Component({
  standalone: true,
  selector: 'slider-dropdown',
  templateUrl: './templates/slider-dropdown.html'
})
export class SliderDropdownComponent implements OnInit {
  @Output() cb?: EventEmitter<any> = new EventEmitter<any>();
  activeItem: {id: number, name: string, children: Array<any>};
  public showChild: boolean = false;
  private activeChild: {id: number, name: string};
  name: string;
  hasNoChild: boolean;
  private records: Array<any>;

  @Input() set data(rec: Array<any>){
    this.records = rec || [];
    this.hasNoChild = (this.records.length==1 && this.records[0].children.length<=1);
  };

  @Input() set parentId(val){
    if(val){
      this.activeItem = this.records.find(r=> r.id === val);
      this.setParent(this.activeItem);
    }
  };
  @Input() set childId(val){
    if(this.activeItem && this.activeItem.children && val){
      this.activeChild = this.activeItem.children.find(r=> r.id === val);
      this.name = this.activeItem.name +' - '+ this.activeChild.name;
    }
  };

  sliderOptions: any = { showClear: true };

  @Input() set options (val){
    this.sliderOptions = Object.assign({}, this.sliderOptions, val);
  }

  constructor( private el: ElementRef){}

  ngOnInit(){}

  selectedData(event: any, item: any){
    this.setParent(item);
    if(item.children && item.children.length) {
      event.stopPropagation();
    }
  }

  setParent(item: any){
    this.activeItem = item;
    if(item){
      this.name = item.name;
      const children = item.children || [];

      this.showChild = (children.length);
      if(!children.length){
        this.cb.emit({ parentId: item.id, childId: null });
      }
    }
  }

  selectAllChild(){
    this.activeChild = null;
    this.name = this.activeItem.name +' - ' + 'All';
    this.cb.emit({ parentId: this.activeItem.id, childId: null });
  }

  selectedChildData(item: any){
    this.activeChild = item;

    let data = { parentId: null, childId: null };

    if(!this.activeItem){
      this.name = null;
    } else {
      data = { parentId: this.activeItem.id, childId: this.activeChild.id };
      this.name = this.activeItem.name +' - '+ this.activeChild.name;
    }
    this.cb.emit(data);
  }

  showAll(event: any){
    event.stopPropagation();
    this.showChild = false;
  }

  clearSelected(){
    this.name = null;
    this.activeItem = null;
    this.showChild = false;
    this.selectedChildData(null);
  }
}
