import {OrgClassModuleAPIResolver} from "../services/api-resolver.service";
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {StudyBoardTypeService, StudyModeTypeService} from "../services/study.service";
import {
  StudyBoardType,
  StudyBoardTypeQueryOptions, StudyModeType,
  StudyModeTypeQueryOptions
} from "../domains/study-type.serializer";

@Component({
  standalone: false,
  templateUrl: './templates/study-mode-list.html',
  styles: [`:host{ display: contents; }`]
})
export class StudyModeListComponent implements OnInit {
  submitted: boolean = false;
  studyBoardCoreState: StudyBoardTypeQueryOptions;
  studyModeCoreState: StudyModeTypeQueryOptions;
  constructor(public fb: FormBuilder,
              private apiResolver: OrgClassModuleAPIResolver,
              private boardTypeService:  StudyBoardTypeService,
              private modeTypeService:  StudyModeTypeService) {
    this.studyBoardCoreState = new StudyBoardTypeQueryOptions();
    this.studyModeCoreState = new StudyModeTypeQueryOptions();
  }

  studyBoardList: Array<StudyBoardType>;
  studyModeList: Array<StudyModeType>;
  ngOnInit(){
    this.boardTypeService.list(this.studyBoardCoreState).subscribe(r => {
      this.studyBoardList = r.entities;
    });
    this.modeTypeService.list(this.studyModeCoreState).subscribe(r => {
      this.studyModeList = r.entities;
    });
  }
}
