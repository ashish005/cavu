import {Injectable, Injector} from '@angular/core';
import  { OrgResourceService } from "@app-global";
import {Team, TeamSerializer} from "../domains/team.serializer";
import {
    TeamUserGroup,
    TeamUserGroupSerializer
} from "../domains/user-group.serializer";
import {GroupCategory, GroupCategorySerializer} from "../domains/group-category.serializer";

@Injectable()
export class TeamService extends OrgResourceService<Team>{
  constructor(public override injector: Injector) { super(injector, 'team', new TeamSerializer()); }
}

@Injectable()
export class TeamGroupService extends OrgResourceService<GroupCategory>{
   constructor(public override injector: Injector) { super(injector, 'team', new GroupCategorySerializer()); }
}

@Injectable()
export class TeamSetupService extends OrgResourceService<TeamUserGroup>{
    constructor(public override injector: Injector) { super(injector, 'team', new TeamUserGroupSerializer()); }
}
