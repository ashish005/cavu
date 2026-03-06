import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {DynamicComponent} from "@app-global";
@Component({
    standalone: false,
    template: `<div>
        <a class="item-title _500">{{context.className}} </a>
        <div class="item-except text-xs h-1x">
            {{context.classSectionName}}
        </div>
    </div>`
})
export class ClassSetionNameActionCell extends DynamicComponent {
    constructor(public activatedRoute: ActivatedRoute) { super(); }
}
