import {ConnectorService} from "./connector.service";
import {OrgIntegrationAPIResolver} from "./api.resolver";
import {CommunicationGatewayService} from "./communication-gateway.service";

export const INTEGRATION_SERVICES = [ ConnectorService, OrgIntegrationAPIResolver, CommunicationGatewayService ];
