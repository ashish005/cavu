import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {INTEGRATION_VIEWS, IntegrationRoutes} from "./integration.routing";
import {INTEGRATION_SERVICES} from "./services";
import {CommunicationGatewayCEComponent} from "./components/communication-gateway-ce.component";
import {CoreModule} from "@app-global";

@NgModule({
    imports: [
        CommonModule,
        CoreModule.forChild(),
        RouterModule.forChild(IntegrationRoutes)
    ],
    providers: [INTEGRATION_SERVICES],
    declarations: [INTEGRATION_VIEWS, CommunicationGatewayCEComponent]
})

export class IntegrationModule {}
