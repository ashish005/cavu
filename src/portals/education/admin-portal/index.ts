import {NgModule} from '@angular/core';
import {CommonModule, CurrencyPipe} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {EDU_ADMIN_Routes, EDU_ADMIN_VIEWS} from "./edu-admin-portal.routing";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(EDU_ADMIN_Routes)
    ],
    declarations: [EDU_ADMIN_VIEWS],
    exports: []
})

export class EduAdminPortal{}
