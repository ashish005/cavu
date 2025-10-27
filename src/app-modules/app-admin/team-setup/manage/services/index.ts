import {TeamSetupAPIResolver} from "./api.resolver";
import {TeamService, TeamSetupService, TeamUserRecordsService} from "./team.service";

export {TeamService} from "./team.service";
export {TeamSetupAPIResolver} from "./api.resolver";

export const TEAM_SERVICES = [ TeamSetupAPIResolver, TeamService, TeamUserRecordsService, TeamSetupService];