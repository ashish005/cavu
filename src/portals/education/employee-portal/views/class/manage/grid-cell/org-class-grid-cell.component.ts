import {Component, Input} from "@angular/core";
import {DynamicComponent} from "@app-global";

@Component({
  standalone: false,
  template: `<div>
    <ng-template ngFor let-section [ngForOf]="context.classSections" let-i="index">
        <span class="btn btn-xs">{{section.name}}</span>
    </ng-template>
</div>`
})
export class OrgClassSectionCellComponent extends DynamicComponent {
}

