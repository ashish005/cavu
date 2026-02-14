import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {GlobalModule} from "@app-global";
import {LOG_ROUTES, LOG_VIEWS} from "./org-log.routing";
import {LogAPIResolver} from "./services/api.resolver";
import {DataLogService, ErrorLogService, OrgTaskLogService} from "./services/log.service";

@NgModule({
  imports: [
    CommonModule,
    LOG_ROUTES,
    GlobalModule
  ],
  providers: [LogAPIResolver, ErrorLogService, DataLogService, OrgTaskLogService],
  declarations: [LOG_VIEWS]
})

export class OrgLogModule{
}
