import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {GridUISwitchCellComponent} from "@app-global";
import {ActivatedRoute} from "@angular/router";
import {
  StudyDegreeTypeService,
  StudyLevelTypeService,
  StudyProgramTypeService,
  StudyStreamTypeService
} from "../../services/study-type.service";
import {
  StudyDegreeTypeQueryOptions,
  StudyLevelTypeQueryOptions,
  StudyProgramTypeQueryOptions, StudyStreamTypeQueryOptions
} from "../../domains/study-type.serializer";

@Component({
  standalone: false,
  templateUrl: './study-type-list.html',
  providers: [StudyDegreeTypeService, StudyLevelTypeService, StudyProgramTypeService, StudyStreamTypeService],
  styles: [`:host{ display: contents; }`]
})
export class StudyTypeListComponent implements OnInit, AfterViewInit {
  isLoading: boolean = false;
  type: string;
  @ViewChild('grid', { static: true }) grid;

  studyDegreeCoreState: StudyDegreeTypeQueryOptions;
  studyLevelCoreState: StudyLevelTypeQueryOptions;
  studyProgramCoreState: StudyProgramTypeQueryOptions;
  studyStreamCoreState: StudyStreamTypeQueryOptions;

  gridOptions: any;
  gridData: Array<any>;


  constructor(public studyDegreeTypeService: StudyDegreeTypeService,
              public studyLevelTypeService: StudyLevelTypeService,
              public studyProgramTypeService: StudyProgramTypeService,
              public studyStreamTypeService: StudyStreamTypeService,
              public activatedRoute: ActivatedRoute) {
    this.studyDegreeCoreState = new StudyDegreeTypeQueryOptions();
    this.gridOptions = {
      header: { title: 'Study', hide: true, footerHide: true, desc: 'Study Type information here', add: true, refresh: true, edit: true, delete: false },
      total: 0,
      hasNext: false,
      hasPrevious: false,
      isOrderable: false,
      columnDefs: [
        {headerName: 'Name', field: 'name' },
        {headerName: 'grid.header.status', field: 'status', cellTemplate: GridUISwitchCellComponent}
      ]
    };
  }

  ngOnInit(){

  }

  ngAfterViewInit(){
    this.changeByType('level');
  }

  changeByType(type){
    this.type = type;
    switch (type){
      case 'level':
        this.grid.options.header.title = "Study Level";
        this.grid.service = this.studyLevelTypeService;
        this.grid.coreState = new StudyLevelTypeQueryOptions();
        break;
      case 'program':
        this.grid.options.header.title = "Study Program";
        this.grid.service = this.studyProgramTypeService;
        this.grid.coreState = new StudyProgramTypeQueryOptions();
        break;
      case 'degree':
        this.grid.options.header.title = "Study Degree";
        this.grid.service = this.studyDegreeTypeService;
        this.grid.coreState = new StudyDegreeTypeQueryOptions();
        break;
      case 'stream':
        this.grid.options.header.title = "Study Stream";
        this.grid.service = this.studyStreamTypeService;
        this.grid.coreState = new StudyStreamTypeQueryOptions();
        break;
    }

    this.isLoading = true;
      this.grid.service.list(this.grid.coreState).subscribe(r => {
          this.gridData = r.entities;
          this.isLoading = false;
      });
  }

  actionCb(inputData: any){

  }

  updateGrid(inputData: any){

  }
}
