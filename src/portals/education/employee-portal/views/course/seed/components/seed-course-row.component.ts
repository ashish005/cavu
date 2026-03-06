import { ASIDE_CLASS, ASIDE_SIZE, SharedService, DynamicComponent} from "@app-global";
import {Component, Input, OnInit} from "@angular/core";
import {CourseSeederAPIResolver} from "../services/api.resolver";

@Component({
  standalone: false,
  selector: 'seed-course-row',
  templateUrl: './templates/seed-course-row.html'
})
export class SeedCourseRowComponent extends DynamicComponent implements OnInit {
  yearList: Array<any> = [
    {id: 1, name: '1'},
    {id: 2, name: '2'},
    {id: 3, name: '3'},
    {id: 4, name: '4'},
    {id: 5, name: '5'},
    {id: 6, name: '6'},
    {id: 7, name: '7'}
  ];

  studyDegreeOptions: any = {title: 'Please select...', label: 'name', key: 'studyDegreeId', listKey: 'id'};
  programOptions: any = {title: 'Program', label: 'name', key: 'studyProgramId', listKey: 'id'};

  durationOptions: any = {title: 'duration', label: 'name', key: 'durationType', listKey: 'id'};
  durationYearOptions: any = {title: 'Year', label: 'name', key: 'durationYear', listKey: 'id'};
  durationTermOptions: any = {title: 'duration Term', label: 'name', key: 'durationTerm', listKey: 'id'};
  eligibilityOptions: any = {title: 'Eligibility', label: 'name', key: 'eligibility', listKey: 'id'};
  @Input() data;
  constructor(private popupService: SharedService, public apiResolver: CourseSeederAPIResolver){
    super();
  }

  ngOnInit(){}

  showBranchPopup(data){
    const popup = {
      header: { text: `Setup ${data.name}`, desc: `${data.name}` },
      aside: ASIDE_CLASS.RIGHT,
      size: ASIDE_SIZE.W_75
    };
    const inputData: any = {
      id: data.id,
      data: data
    };

    // let modal$ = this.popupService.showCustomPopup(OrgBranchComponent, popup, inputData);
    // modal$.then((resp)=>{
    //   this.popupService.destroy();
    // }, (err)=>{
    //   this.popupService.destroy();
    // });
  }
}
