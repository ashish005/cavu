import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PROFILE_VIEWS, ProfileRoutes} from "./profile.routing";
import {GlobalModule} from "@app-global";
import {RouterModule} from "@angular/router";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ProfileRoutes),
      GlobalModule
    ],
    providers: [],
    declarations: [PROFILE_VIEWS]
})

export class ProfileModule{}
