import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {GlobalModule} from "@app-global";
import {CLIENT_COMPONENT} from "./components";
import {RouterModule} from "@angular/router";
import {CLIENT_VIEWS, ClientProject_Routes} from "./manage-client.routing";
import {CLIENT_SERVICES} from "./services";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(ClientProject_Routes),
        GlobalModule
    ],
    providers: [CLIENT_SERVICES],
    declarations: [CLIENT_VIEWS, CLIENT_COMPONENT]
})

export class ClientByAccountModule {}
