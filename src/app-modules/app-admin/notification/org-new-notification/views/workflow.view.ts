import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {pairwise, startWith} from "rxjs";
import {ORG_PROCESS_TYPE} from "@app-base/enums";

@Component({
  templateUrl: './templates/workflow.html'
})
export class NotificationWorkflowView implements OnInit {
  processMasterType: string = ORG_PROCESS_TYPE.COMM_COLLABARATION;
  ngOnInit() {}
}
