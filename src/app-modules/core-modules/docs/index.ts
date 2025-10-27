import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {GlobalModule} from "@app-global";
import {DOC_ROUTES, DOC_VIEWS} from "./docs.routing";

@NgModule({
  imports: [
    CommonModule,
    DOC_ROUTES,
    GlobalModule
  ],
  declarations: [DOC_VIEWS]
})

export class DocsModule{
}
