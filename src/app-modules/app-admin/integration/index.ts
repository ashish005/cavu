import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {INTEGRATION_VIEWS, IntegrationRoutes} from "./integration.routing";
import {INTEGRATION_SERVICES} from "./services";
import {CommunicationGatewayCEComponent} from "./components/communication-gateway-ce.component";
import {GlobalModule} from "@app-global";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule,
        RouterModule.forChild(IntegrationRoutes),
        GlobalModule
    ],
    providers: [INTEGRATION_SERVICES],
    declarations: [INTEGRATION_VIEWS, CommunicationGatewayCEComponent]
})

export class IntegrationModule {}
