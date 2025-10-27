import {GlobalModule} from "@app-global";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {SettingAccessSetupRoutes} from "./access-setup.routing";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SettingAccessSetupRoutes),
    GlobalModule
  ],
  providers: [],
  declarations: []
})

export class SettingAccessSetupModule {}
