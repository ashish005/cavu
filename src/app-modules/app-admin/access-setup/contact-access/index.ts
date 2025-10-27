import {NgModule} from '@angular/core';
import {CommonModule, CurrencyPipe} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {GlobalModule} from "@app-global";
import {User_Acccess_Setup_Routes, USER_ACCESS_SETUP_VIEWS} from "./contact-access-setup.routing";
import {UserAccessSetupAPIResolver} from "./services/api.resolver";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(User_Acccess_Setup_Routes),
        GlobalModule
    ],
    providers: [UserAccessSetupAPIResolver],
    declarations: [USER_ACCESS_SETUP_VIEWS],
    exports: []
})

export class ContactAccessSetupModule{}
