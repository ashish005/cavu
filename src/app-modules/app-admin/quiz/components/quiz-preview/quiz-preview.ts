import {Component, EventEmitter, Input, OnChanges, Output} from "@angular/core";

@Component({
    standalone: false,
  selector: 'quiz-preview',
  templateUrl: './quiz-preview.html',
  styleUrls:['./quiz-preview.scss']
})
export class QuizPreviewComponent implements OnChanges{
  @Input() qStage: any; // string = 'preview' || 'pass' || 'fail';
  @Output() cb: EventEmitter<any> = new EventEmitter<any>();

  qActiveStage: any;
  quizInfo: any = {
    title: 'C++ Quiz',
    preview: {
      class: 'preview',
      info:'To pass correctly answer 2 of 3 questions',
      description: 'Select Start to begin the quiz, move forward and back to answer as many questions as you can. Select Quit at any time to exit. Select Finish to complete the quiz and review your results.',
      highlight: ['Start', 'Finish', 'Quit']
    },
    fail: {
      class: 'fail',
      info:'You correctly answered 0 of 3 questions (pass mark 2)',
      description: 'Select Retake to restart the quiz. Select Done to exit the quiz.',
      highlight: ['Retake', 'Done']
    },
    pass: {
      class: 'pass',
      info:'You correctly answered 2 of 3 questions',
      description: 'Select Review to see the correct answers for the question answered incorrectly, or Select Done to exit the quiz',
      highlight: ['Review', 'Done']
    }
  };

  ngOnChanges(){
    this.updateStage(this.qStage);
  }

  updateStage(stage){
    this.qActiveStage = this.quizInfo[stage];
  }

  quizAction(){
    this.cb.emit(this.qStage);
  }
}
