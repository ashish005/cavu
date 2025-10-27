import {Component, Input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'dual-list-filter',
  templateUrl: './views/dual-listbox-filter.html', standalone: true, imports: [CommonModule, FormsModule]
})

export class DualListboxFilterComponent {
  @Input() options: any;
  @Input() first: any;
  @Input() second: any;
}
