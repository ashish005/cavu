import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import { CONTACT_VIEWS, ContactRoutes} from "./contact.routing";
import {GlobalModule} from "@app-global";
import {RouterModule} from "@angular/router";
import {ContactAPIResolver} from "./services/api.resolver";
import {ContactService} from "./services/contact.service";
import {CONTACTS_GRID_CELl} from "./grid-cells";
import {CONTACTS_COMPONENTS} from "./components";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ContactRoutes),
        GlobalModule
    ],
    providers: [ContactAPIResolver, ContactService],
    declarations: [CONTACT_VIEWS, CONTACTS_COMPONENTS, CONTACTS_GRID_CELl]
})

export class ContactsModule{}
