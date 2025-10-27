import {ProjectModuleService} from "./project-module.service";
import {ProjectAPIResolver, ProjectByIdAPIResolver} from "./api.resolver";
import {ProjectResourceService} from "./project-resource.service";
import {ProjectWorkflowService} from "./project-workflow.service";
import {ContactService} from "./client-contact.service";
import {ProjectTimeTrackingService} from "./time-tracking.service";
import {RecurringInvoiceService} from "./recurring-invoice.service";
import {ProjectService} from "./project.service";
import {ProjectStatusTrackingService} from "./project-status-tracking.service";

export {ProjectModuleService} from "./project-module.service";
export { ProjectAPIResolver, ProjectByIdAPIResolver } from "./api.resolver";
export {ProjectResourceService} from "./project-resource.service";
export {ProjectWorkflowService} from "./project-workflow.service";
export {ProjectStatusTrackingService} from "./project-status-tracking.service";

export const PROJECT_SERVICES = [
    ProjectAPIResolver, ProjectByIdAPIResolver,
    ProjectModuleService, ProjectResourceService,
    ProjectWorkflowService,
    ContactService, ProjectStatusTrackingService, ProjectTimeTrackingService,
    RecurringInvoiceService, ProjectService
];