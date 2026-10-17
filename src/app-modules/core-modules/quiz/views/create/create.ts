import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    standalone: false,
  templateUrl: './create.html'
})
export class CreateComponent implements OnInit {
  public quizPerms: any = { r: false, w: true, share: true };
  public quizTypes: Array<any> = [
    {id: 1, name: 'Multiple Choice'},
    {id: 2, name: 'Yes/No'},
    {id: 3, name: 'Open-Ended'},
    {id: 4, name: 'Fill in the Blank'},
    {id: 5, name: 'Matching'},
    {id: 6, name: 'Definitions'},
  ];

  activeQuiz: any = this.quizTypes[0];

  constructor(private router: Router, private _activatedRoute: ActivatedRoute) {
  }

  ngOnInit(){}

  quizTypeChange(quiz){
    this.activeQuiz = quiz;
  }
}
