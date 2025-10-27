import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";

@Component({
  selector: 'multiselect-dropdown',
  templateUrl: './templates/multiselect-dropdown.html', standalone: true, imports: [CommonModule, FormsModule, NgSelectModule]
})
export class MultiCheckboxComponent implements OnInit, AfterViewInit {
  @Input() formControlName;
  @Input() items:Array<string> = [];
  @Input() virtualScroll: boolean = false;
  @Input() bindLabel: string;
  @Input() bindValue: string;
  @Input() placeholder: string;
  @Input() selected: Array<any>;
  @Input() titleInfo: string;
  @Input() disabled?: boolean = false;
  @Input() addNewEnabled?: boolean = false;
  @Output() cb: EventEmitter<any> = new EventEmitter<any>();

  constructor(private fb: FormBuilder){}

  ngOnInit() {}

  onSelectAllChange(e){
    if(e.target.checked){
      const key = this.bindValue;
      this.selected = this.items.map((item)=> item[key]);
    } else {
      this.selected = [];
    }
  }

  onChange(item){
    this.cb.emit(this.selected);
  }

  ngAfterViewInit(){
    const itemCount = (this.items || []).length;
    if(itemCount == 1){
      const item = this.items[0][this.bindValue];
      //this.selected = [item];
      //this.disabled = true;
      this.cb.emit([item]);
    }
  }
}
