import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output, TemplateRef,
    ViewChild
} from "@angular/core";
import {CommonModule} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'select-dropdown',
  templateUrl: './templates/select-dropdown.html',
    styles: [
        `.card {
            position: relative;
            display: -webkit-box;
            display: flex;
            flex-direction: column;
            min-width: 0;
            word-wrap: break-word;
            background-color: #fff;
            background-clip: border-box;
            border: 1px solid rgba(0, 0, 0, 0.125);
            border-radius: 0.25rem;
        }
        .card-body { flex: 1 1 auto; padding: 1.25rem; }`
    ],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule]
})
export class SelectDropdownComponent implements AfterViewInit {
  @Input() contentTemplate: TemplateRef<any>;
  @Input() items:Array<any> = [];
  @Input() title: string;
  //@Input() selected: string;
  @Input() disabled?: boolean = false;
  @Input() addNewEnabled?: boolean = false;
  @Input() bindLabel : string = "name";
  @Input() bindValue : string = "id";

  @Input() control: any;

  @Output() cb: EventEmitter<string> = new EventEmitter<string>();

  constructor(){}

  onChange(e){
      this.cb.emit(this.control.value);
  }

  ngAfterViewInit(){
    const itemCount = (this.items || []).length;
    if(itemCount == 1){
      const item = this.items[0][this.bindValue];
      this.control.setValue(item);
    }
  }
}
