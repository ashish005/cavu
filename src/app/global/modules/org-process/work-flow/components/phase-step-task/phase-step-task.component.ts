import {Component, Injectable, Injector, Input, OnInit, OnChanges, SimpleChanges} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ViewExtender} from "../../../../../extender-classes";
import {
    PhaseStepTask,
    PhaseStepTaskQueryOptions,
    PhaseStepTaskSerializer
} from "../../models/phase-step-task.serializer";
import {OrgResourceService} from "../../../../../services";
import {GridUISwitchCellComponent} from "../../../../../components";
import {ProcessNode} from "../../models";

@Injectable()
export class PhaseStepTaskService extends OrgResourceService<PhaseStepTask>{
    constructor(public override injector: Injector) {
        super(injector, 'phaseStepTask', new PhaseStepTaskSerializer());
    }
}

@Component({
  standalone: false,
  selector: 'phase-task-grid',
  templateUrl: './phase-step-task.html',
  styles: [':host { display: contents; }'],
  providers: [PhaseStepTaskService]
})
export class PhaseStepTaskComponent extends ViewExtender<PhaseStepTask> implements OnInit, OnChanges {
  @Input() process?: ProcessNode;
  override coreState: PhaseStepTaskQueryOptions = new PhaseStepTaskQueryOptions();
  constructor(public override service: PhaseStepTaskService, public override activatedRoute: ActivatedRoute) {
    super(activatedRoute, service);
    this.gridOptions.columnDefs = [
        {headerName: 'Name', field: 'name'},
        {headerName: 'Frequency', field: 'frequencyTypeName'},
        {headerName: 'Priority', field: 'taskPriorityName'},
        {headerName: 'Manual', field: 'isManual', cellTemplate: GridUISwitchCellComponent},
        {headerName: 'Primary', field: 'isPrimary', cellTemplate: GridUISwitchCellComponent},
        {headerName: 'Verify', field: 'isVerificationRequired', cellTemplate: GridUISwitchCellComponent},
        {headerName: 'StatusOnMail', field: 'isStatusOnMailRequired', cellTemplate: GridUISwitchCellComponent},
        {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent}
    ];
  }

  ngOnInit(){
    this.coreState.workflowId = this.process?.id || 0;
    super.populateGrid();
  }

  ngOnChanges(changes: SimpleChanges) {
      if(changes['process'] && !changes['process'].firstChange){
          this.coreState.workflowId = this.process?.id || 0;
          this.populateGrid();
      }
  }

    actionCb(row: PhaseStepTask) {
    /*
    const {id, name} = row;
    const inputData: any = { id: id, data: row };
    const popupHeaderOptions = { text: `${name}`, desc: `` };
    this.apiResolver.ceOrgTaskPopup(inputData, popupHeaderOptions, ()=>{});
     */
  }
}
