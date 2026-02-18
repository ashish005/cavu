import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";

@Component({
    standalone: false,
  templateUrl: './templates/workflow.html'
})
export class NotificationWorkflowView implements OnInit {
  processMasterType: string = "COMM_COLLABARATION";
  ngOnInit() {}
}
