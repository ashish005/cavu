import {DynamicComponent} from "@app-global";
import {Component} from "@angular/core";
import {TeamUserGroup} from "../domains/user-group.serializer";
import {TeamSetupAPIResolver} from "../services";

@Component({
  standalone: false,
    template: `
      <a class="btn btn-xs text-xs text-primary" (click)="showStaticRecordPopup()">Add Member</a>
    <span class="text-right" *ngIf="context.totalRules"> {{context.totalRules}} Rules </span>
    <span *ngIf="!context.totalRules" class="text-xs"><i class="fa fa-warning text-danger"></i></span>
`
})
export class TeamRuleCellComponent extends DynamicComponent{
  constructor(public apiResolver: TeamSetupAPIResolver) { super(); }
  showStaticRecordPopup()
  {
    this.apiResolver.showStaticRecordPopup({ id: this.context.id }, { text: `Team Setup`, desc: 'Team' }, ()=>{});
  }
}
