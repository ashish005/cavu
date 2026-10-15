import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {AsidePanelComponent, GlobalModule} from "@app-global";
import {PartyApiService} from "./services/party-api.service";
import {PartyListView} from "./views/party-list.view";
import {PartyDetailView} from "./views/party-detail.view";
import {PartyEditorComponent} from "./components/party-editor.component";

/**
 * The customer / vendor / employee screens, shared by the admin module (`app/admin/parties`) and the sector portals
 * (`org-emp`, `client`, `supplier`). The role comes from route data (`roleFrom`).
 */
@NgModule({
    imports: [CommonModule, FormsModule, RouterModule, GlobalModule, AsidePanelComponent],
    providers: [PartyApiService],
    declarations: [PartyListView, PartyDetailView, PartyEditorComponent],
    exports: [PartyListView, PartyDetailView, PartyEditorComponent]
})
export class PartyViewsModule {}
