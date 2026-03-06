import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {PARENT_Routes, PARENT_VIEWS} from "./parent-portal.routing";
import {GlobalModule} from "@app-global";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PARENT_Routes),
    GlobalModule
  ],
  providers: [],
  declarations: [PARENT_VIEWS]
})

export class EduParentPortal{
  constructor(){}
}
