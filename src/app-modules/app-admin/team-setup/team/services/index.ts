import {TeamSetupAPIResolver} from "./api.resolver";
import {TeamGroupService, TeamService, TeamSetupService} from "./team.service";

export {TeamGroupService, TeamService} from "./team.service";
export {TeamSetupAPIResolver} from "./api.resolver";

export const TEAM_SERVICES = [ TeamSetupAPIResolver, TeamGroupService, TeamService, TeamSetupService];