import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {QUIZ_VIEWS, QuizRoute} from "./quiz.routing";
import {GlobalModule} from "@app-global";
import {QUIZ_COMPONENTS} from "./components";

@NgModule({
  imports: [
    CommonModule,
    QuizRoute,
    GlobalModule
  ],
  providers: [],
  declarations: [QUIZ_VIEWS, QUIZ_COMPONENTS]
})

export class QuizModule {
}
