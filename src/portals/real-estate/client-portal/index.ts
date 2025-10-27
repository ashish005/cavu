import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";
import {Client_Routes, CLIENT_VIEWS} from "./client-portal.routing";
import {AssociateService} from "./services/associate.service";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(Client_Routes),
    GlobalModule
  ],
  providers: [AssociateService],
  declarations: [CLIENT_VIEWS]
})

export class ClientPortal{
  constructor(){}
}
