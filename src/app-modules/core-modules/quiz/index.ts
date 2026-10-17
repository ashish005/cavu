import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {QUIZ_VIEWS, QuizRoute} from "./quiz.routing";
import {GlobalModule} from "@app-global";
import {QUIZ_COMPONENTS} from "./components";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule,
    QuizRoute,
    GlobalModule
  ],
  providers: [],
  declarations: [QUIZ_VIEWS, QUIZ_COMPONENTS]
})

export class QuizModule {
}
