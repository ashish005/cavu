import {Injectable, Injector} from '@angular/core';
import  { OrgResourceService } from "@app-global";
import {Team, TeamSerializer} from "../domains/team.serializer";
import {
    TeamUserGroup,
    TeamUserGroupSerializer
} from "../domains/user-group.serializer";
import {Observable, BehaviorSubject, tap} from "rxjs";

@Injectable()
export class TeamService extends OrgResourceService<Team>{
  constructor(public override injector: Injector) { super(injector, 'team', new TeamSerializer()); }
}

@Injectable()
export class TeamSetupService extends OrgResourceService<TeamUserGroup>{
    public teamChangeEvent: BehaviorSubject<TeamUserGroup> = new BehaviorSubject<TeamUserGroup>(null);
    constructor(public override injector: Injector) { super(injector, 'team', new TeamUserGroupSerializer()); }
}

@Injectable()
export class TeamUserRecordsService extends OrgResourceService<Team>{
    constructor(public override injector: Injector) { super(injector, 'teamRecord', new TeamSerializer()); }

    getUserRecords(data) {
        return this.httpClient
            .post(`${this.viewUrl}`, data, this.requestHeaders)
            .pipe(
                tap(
                    (resp: any) => console.log('read logged'),
                    (error)=>{ this.handleError(error, () => this.getUserRecords(data)) }
                )
            );
    }

    getLookupByKey(filterKey) {
        return this.httpClient
            .get(`${this.viewUrl}/lookup/${filterKey}`, this.requestHeaders)
            .pipe(
                tap(
                    (resp: any) => console.log('read logged'),
                    (error)=>{ this.handleError(error, () => this.getLookupByKey(filterKey)) }
                )
            );
    }
}
@Injectable()
export class MappedUserRecordService extends OrgResourceService<Team>{
    constructor(public override injector: Injector) { super(injector, 'userGroupMapping', new TeamSerializer()); }
}