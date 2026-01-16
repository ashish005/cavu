import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'survey', standalone: false,
  templateUrl: './templates/survey.html',
})
export class SurveyComponent implements OnInit {
  surveyPoints: Array<number> = [1,2,3,4,5,6,7,8,9,10];
  ngOnInit() {

  }
}
