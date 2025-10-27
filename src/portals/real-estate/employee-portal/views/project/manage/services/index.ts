import { ProjectAPIResolver } from "./api.resolver";
import { ProjectService } from "./project.service";

export { ProjectAPIResolver } from "./api.resolver";

export const PROJECT_SERVICES = [
    ProjectAPIResolver, ProjectService
];