import {EventEmitter, Injectable, Injector} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {
    TeamSetupLookup,
    TeamSetupLookupSerializer
} from "../domains/lookup.serializer";
import {ASIDE_CLASS, ASIDE_SIZE, OrgResourceService, SharedService} from "@app-global";
import {throwError, of, catchError, map} from "rxjs";
import {TeamGroupCeView, TeamUserFilterTypeView} from "../components";

@Injectable()
export class TeamSetupAPIResolver extends OrgResourceService<TeamSetupLookup> implements Resolve<any> {
    masterType: TeamSetupLookup;
    constructor(public override injector: Injector, private sharedService: SharedService) {
      super(injector, 'teamLookup', new TeamSetupLookupSerializer());
    }

    resolve(route: ActivatedRouteSnapshot) {
        const success = (results) => { this.masterType = results['data']; };
        const failure = (err: any) => {};
        const setup = this.read(this.apiVersion);
        return this.performRouteResolver(route.data, setup, success, failure);
    }

    teamCreateEditPopup(inputData, headerOptions, cb){
        const popupOptions = {
            header: headerOptions || { text: `Group`, desc: 'Group' },
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_75
        };
        inputData = inputData || {
            id: null,
            data: null
        };

        const onSuccess = (resp)=> {this.sharedService.destroy(); cb(); };
        const failure = (resp)=> {this.sharedService.destroy();};
        this.sharedService.showCustomPopup(TeamGroupCeView, popupOptions, inputData).then(onSuccess, failure);
    }

    showUserFilterTypePopup(inputData, headerOptions) {
        const popupOptions = {
            header: headerOptions ||{text: `User Filter Type`, desc: ''},
            aside: ASIDE_CLASS.RIGHT,
            size: ASIDE_SIZE.W_25
        };
        const onSuccess = (resp)=> {this.sharedService.destroy();};
        const failure = (resp)=> {this.sharedService.destroy();};
        this.sharedService.showCustomPopup(TeamUserFilterTypeView, popupOptions, inputData).then(onSuccess, failure);
    }

    getSearchList(queryOptions) {
        return this.httpClient
            .get(`${this.baseSectorAPIUrl}teamGroup?${queryOptions}`, this.requestHeaders)
            .pipe(
                map(resp => resp),
                catchError(error=> this.handleError(error, () => this.getSearchList(queryOptions)))
            );
    }

    getLookupByKey(groupId, filterKey) {
        return this.httpClient
            .get(`${this.baseSectorAPIUrl}teamRuleFilterLookup/${groupId}/${filterKey}`, this.requestHeaders)
            .pipe(
                map(resp => resp),
                catchError(error=> this.handleError(error, () => this.getLookupByKey(groupId, filterKey)))
            );
    }

    getUserFilteredRecords(data){
        return this.httpClient
            .post(`${this.baseSectorAPIUrl}teamRuleFilterLookup/user-records`, data, this.requestHeaders)
            .pipe(
                map(resp => resp),
                catchError(error=> this.handleError(error, () => this.getUserFilteredRecords(data)))
            );
    }

    /*getTaskList(queryOptions: CoreQueryOptions) {// : Observable<OrgTaskNotification>
      return this.httpClient
        .get(`${this.coreService.baseSectorAPIUrl}notification/task-notification?${queryOptions.toQueryString()}`, this.requestHeaders)
        .pipe(map(resp => resp), catchError(this.throwError));
    }

    public getEmploeeList(queryOptions: CoreQueryOptions): Observable<any> {
      return this.httpClient
        .get(`${this.coreService.baseSectorAPIUrl}'lookup/typeahead?type=employee?${queryOptions.toQueryString()}`, this.requestHeaders)
        .pipe(map(resp => resp), catchError(this.throwError));
    }*/
}
