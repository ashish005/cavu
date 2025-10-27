import {Component, Input} from "@angular/core";
import {DynamicComponent} from "@app-global";

@Component({
    template: `<div>
        <a class="text-xs _500"> To {{ context.queue?.length }} Users</a>
    </div>`
})
export class InvoiceHistoryNameCell extends DynamicComponent {
    constructor() {
        super();
    }
}
