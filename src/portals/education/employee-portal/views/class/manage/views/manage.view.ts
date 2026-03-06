import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ViewExtender} from "@app-global";
import {OrgClassService} from "../services/class.service";
import {OrgClass, OrgClassQueryOptions} from "../domains/class.serializer";
import {OrgClassModuleAPIResolver} from "../services/api-resolver.service";
import {StudyModeTypeLookup} from "../domains/lookup";
import {OrgClassSectionCellComponent} from "../grid-cell";

@Component({
    standalone: false,
  templateUrl: './templates/manage.html'
})
export class ClassManageView extends ViewExtender<OrgClass> implements OnInit {
  override coreState: OrgClassQueryOptions = new OrgClassQueryOptions();
  studyModeType: StudyModeTypeLookup;
  constructor(public override service: OrgClassService,
              public override activatedRoute: ActivatedRoute,
              private apiResolver: OrgClassModuleAPIResolver) {
    super(activatedRoute, service);
    this.gridOptions.columnDefs = [
      {headerName: 'Name', field: 'name' },
      {headerName: 'Study Mode', field: 'studyModeTypeName' },
      {headerName: 'Class Teacher', field: 'classTeacherName' },
      {headerName: 'Sections', field: '', cellTemplate: OrgClassSectionCellComponent }
    ];
  }

  ngOnInit(){
      this.activatedRoute.params.subscribe(routeParams => {
          this.coreState.studyModeTypeId = routeParams['id'];
          this.studyModeType = this.apiResolver.masterType.studyMode.find(r => r.id  == this.coreState.studyModeTypeId);
          this.populateGrid();
      });
  }

  actionCb(data: any){
    const inputData: any = {
      id: data.id,
      data: data
    };
    this.apiResolver.addUpdateClassPopup(inputData, { text: `Edit Class`, desc: '' }, this.refreshGrid);
  }

    createClass(){
        const inputData: any = {
            id: null,
            data: null
        };
        this.apiResolver.addUpdateClassPopup(inputData, { text: `New Class`, desc: '' }, this.refreshGrid);
    }
}
