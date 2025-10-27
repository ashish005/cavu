import {DynamicComponent} from "@app-global";
import {Component} from "@angular/core";

@Component({
  standalone: false,
    template: `
    <span class="text-right" *ngIf="context.totalRules"> {{context.totalRules}} Rules </span>
    <span *ngIf="!context.totalRules" class="text-xs"><i class="fa fa-warning text-danger"></i></span>
`
})
export class TeamRuleCellComponent extends DynamicComponent{}
