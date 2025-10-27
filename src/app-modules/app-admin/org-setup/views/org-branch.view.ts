import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Branch, BranchQueryOptions} from "../domains/org-branch.serializer";
import {OrgBranchService} from "../services/org-branch.service";
import {OrgService} from "../services/org.service";
import {
    ASIDE_CLASS,
    ASIDE_SIZE,
    DateFormatCell,
    GridUISwitchCellComponent,
    SharedService,
    ViewExtender
} from "@app-global";
import {OrgBranchCreateEditComponent} from "../components/branch-create-edit.component";

@Component({
  templateUrl: './templates/org-branch.html',
  styles: [`:host { display: contents; }`]
})
export class OrgBranchView extends ViewExtender<Branch> implements OnInit {
    @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
    @ViewChild('routerActionTemplate', { static: true }) public routerActionTemplate: TemplateRef<any>;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    override coreState: BranchQueryOptions = new BranchQueryOptions();
    constructor(public router: Router,
                public override activatedRoute: ActivatedRoute,
                public orgService: OrgService, public sharedService: SharedService,
                public override service: OrgBranchService) {
        super(activatedRoute, service);
        //this.gridOptions.header.edit = false;
        this.gridOptions.columnDefs = [
            {headerName: 'Name', field: 'name' },
            {headerName: 'Address', field: 'address' },
            {headerName: 'branchCode', field: 'branchCode' },
            {headerName: 'Contact', field: 'contactName' },
            {headerName: 'contactNo1', field: 'contactNo1' },
            {headerName: 'emailId1', field: 'emailId1' },
            {headerName: 'Established', field: 'establishedDate', cellTemplate: DateFormatCell },
            {headerName: 'Head Branch', field: 'isHeadBranch', cellTemplate: GridUISwitchCellComponent },
            {headerName: 'Active', field: 'isActive', cellTemplate: GridUISwitchCellComponent }
        ]
    }

    ngOnInit(){
        super.populateGrid();
    }
    ngOnDestroy(){ super.ngOnDestroy(); }

  actionCb(data: Branch){
    const { id } = this.orgService.org;
    const inputData: any = {
      id: data.id,
      unitId: id,
      data: data
    };

    this.showBranchPopup(inputData);
  }

  addBranch(){
    const { countryId, id } = this.orgService.org;
    const branchData = new Branch();
    branchData.countryId = countryId;

    const inputData: any = {
      id: null,
      unitId: id,
      data: branchData
    };

    this.showBranchPopup(inputData);
  }

  showBranchPopup(inputData: any){
    const popup = {
      header: { text: `Org Branch`, desc: '' },
      aside: ASIDE_CLASS.RIGHT,
      size: ASIDE_SIZE.W_50
    };

    const success = (resp: any) => {
      this.sharedService.destroy();
        super.populateGrid();
    };

    const error = (err: any) => {
      this.sharedService.destroy();
    };

    let modal$ = this.sharedService.showCustomPopup(OrgBranchCreateEditComponent, popup, inputData);
    modal$.then(success, error);
  }

  syncTaskForBranch(data: Branch){
    const success = (r)=>{

    };
    const failure = (r)=>{ };
    this.service.syncBranchTasks(data.id).subscribe(success, failure);
  }
}
