import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from "@angular/core";
import {GridUISwitchCellComponent, ViewExtender} from "@app-global";
import {ActivatedRoute} from "@angular/router";
import {OrgBranchService} from "../services/business.service";
import {OrgBranch, OrgBranchQueryOptions} from "../domains/org-branch.serializer";
import {OrgBranchNameCell} from "./grid.cell.component";

@Component({
  templateUrl: './templates/org-branches.html',
  standalone: false
})
export class OrgBranchesComponent extends ViewExtender<OrgBranch> implements OnInit{
  override coreState: OrgBranchQueryOptions = new OrgBranchQueryOptions();
  constructor(protected override activatedRoute: ActivatedRoute, protected override service: OrgBranchService) {
    super(activatedRoute, service);
    this.gridOptions.columnDefs = [
      {headerName: 'Name', field: 'name', cellTemplate: OrgBranchNameCell },
      {headerName: 'Address', field: 'address'},
      {headerName: 'Website', field: 'websiteUrl'},
      {headerName: 'Demo', field: 'applyDemoSeed', cellTemplate: GridUISwitchCellComponent},
      {headerName: 'Master', field: 'applyMasterSeed', cellTemplate: GridUISwitchCellComponent},
      {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent}
    ];
  }
  submitted: boolean;

  @ViewChild('footerTemplate', { static: true }) public footerTemplate: TemplateRef<any>;
  @Input() id: string;
  @Output() onOk: EventEmitter<any>= new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any>= new EventEmitter<any>();

  ngOnInit(){
    this.coreState.orgUnitId = this.id;
    this.refreshGrid();
  }

  actionCb(e){}
}
